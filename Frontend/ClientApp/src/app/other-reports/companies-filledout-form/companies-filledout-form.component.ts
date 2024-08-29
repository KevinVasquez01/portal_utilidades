import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { UtilidadesAPIService } from 'src/app/services/UtilidadesAPI/utilidades-api.service';
import { ExportService } from '../../services/export.service';

interface ExcelCompanies {
  'Fecha': string
  'Aliado ERP': string;
  'Servicios contratados': string;
  'NIT sin dígito de verificación': string;
  'Dígito Verificación': string;
  'Razón Social Empresa': string;
  'Esquema de Impuestos': string;
  Dirección: string;
  Ciudad: string;
  'Correo electrónico Recepción': string;
  'Responsabbilidades Fiscales': string;
  TestSetId: string;
  'Nombre Usuario Autorizado': string;
  Correo: string;
  Celular: string;
}

interface data {
  Code: string;
  Name: string;
}

@Component({
  selector: 'app-companies-filledout-form',
  templateUrl: './companies-filledout-form.component.html',
  styleUrls: ['./companies-filledout-form.component.scss'],
})
export class CompaniesFilledoutFormComponent implements AfterViewInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource = new MatTableDataSource<ExcelCompanies>([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  companiesResult: CompanyR_UC[] = [];
  companiesExcel: ExcelCompanies[] = [];
  listdist: Array<jsonDistI> = [];
  taxschemes: data[] = [];
  cityCodes: data[] = [];
  responsabilitytypes: data[] = [];

  generando= false;
  showresults = false;

  constructor(
    breakpointObserver: BreakpointObserver,
    private _UtilAPI: UtilidadesAPIService,
    private datePipe: DatePipe,
    private _getGetDataQA: APIGetServiceQA,
    private _dataElementsU: DataElementsService,
    private _export: ExportService
  ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['documentNumber', 'name', 'lastupdate']
        : ['distributorId', 'documentNumber', 'name', 'lastupdate'];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.companiesExcel;
    this.dataSource.sort = this.sort;
    this.awaitDataElements();
  }

  fechaInicio: string = '';
  fechaFin: string = '';

  async generate() {
    this.generando = true;
    let start_report = this.range.controls['start'].hasError(
      'matStartDateInvalid'
    )
      ? new Date()
      : new Date(this.range.controls['start'].value);
    let end_report = this.range.controls['end'].hasError('matStartDateInvalid')
      ? new Date()
      : new Date(this.range.controls['end'].value);

    this.fechaInicio =
      this.datePipe.transform(start_report, 'yyyy-MM-dd') || '';
    this.fechaFin = this.datePipe.transform(end_report, 'yyyy-MM-dd') || '';
    if (this.fechaInicio != '' && this.fechaFin != '') {
      let result = await this.getCompanies(this.fechaInicio, this.fechaFin);
      this.companiesResult = JSON.parse(JSON.stringify(result));

      this.companiesExcel = [];
      for (let i = 0; i < this.companiesResult.length; i++) {
        let aliado = this.listdist.find(
          (x) => x.Id == this.companiesResult[i].distributorid
        )?.Name;
        let taxScheme = this.taxschemes.find(
          (x) => x.Code == this.companiesResult[i].taxscheme
        )?.Name;
        let ciudad = this.cityCodes.find(
          (x) => x.Code == this.companiesResult[i].contacts[0]?.citycode
        )?.Name;

        let servicios = this.companiesResult[i].dataCreations[0]
          ?.salesinvoice_included
          ? 'FE'
          : '';
        servicios += this.companiesResult[i].dataCreations[0]
          ?.documentsuport_included
          ? (servicios != '' ? ';' : '') + 'DS'
          : '';
        servicios += this.companiesResult[i].dataCreations[0]
          ?.payrroll_included
          ? (servicios != '' ? ';' : '') + 'NE'
          : '';
        servicios += this.companiesResult[i].dataCreations[0]
          ?.reception_salesinvoice_included
          ? (servicios != '' ? ';' : '') + 'RFE'
          : '';

        let responsabilidades = '';
        for(let j =0; j<this.companiesResult[i].responsibilities.length; j++){
          let reponsabilidad = this.responsabilitytypes.find(x=> x.Code == this.companiesResult[i].responsibilities[j].responsabilitytypes);
          responsabilidades += reponsabilidad != undefined ? (responsabilidades != '' ? ';' : '') + reponsabilidad.Name : '';
        }
        this.companiesExcel.push({
          Fecha: this.datePipe.transform(this.companiesResult[i].dataCreations[0]?.date_creation, 'dd/MM/yyyy') || '',
          'Aliado ERP':
            aliado != undefined
              ? aliado
              : this.companiesResult[i].distributorid != ''
              ? this.companiesResult[i].distributorid
              : 'NINGUNO',
          'Servicios contratados': servicios,
          'NIT sin dígito de verificación':
            this.companiesResult[i].documentnumber,
          'Dígito Verificación': this.companiesResult[i].checkdigit,
          'Razón Social Empresa':
            this.companiesResult[i].name != ''
              ? this.companiesResult[i].name
              : `${this.companiesResult[i].firstname} ${this.companiesResult[i].familyname}`,
          'Esquema de Impuestos':
            taxScheme != undefined ? taxScheme : 'No Aplica',
          Dirección: this.companiesResult[i].contacts[0]?.addressline,
          Ciudad: ciudad != undefined ? ciudad : '',
          'Correo electrónico Recepción':
            this.companiesResult[i].contacts[0]?.financialsupportemail,
          'Responsabbilidades Fiscales': responsabilidades,
          TestSetId: this.companiesResult[i].series[0]?.testsetid,
          'Nombre Usuario Autorizado':
            this.companiesResult[i].users[0]?.name,
          Correo: this.companiesResult[i].users[0]?.email,
          Celular: this.companiesResult[i].users[0]?.telephone,
        });
      }
      this.dataSource = new MatTableDataSource(this.companiesExcel);
      this.generando = false;
      this.showresults = true;
    }
  }

  getCompanies(from: string, until: string) {
    return new Promise<any>((resolve, reject) => {
      this._UtilAPI.GetCompaniesFromUntil(from, until).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject();
        }
      );
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  //Espera a que termine de obtener DataElements
  async awaitDataElements() {
    await this.GetTaxschemes();
    await this.GetDistributors();
    await this.GetCities();
    await this.GetResponsabilitytypes();

    console.log(this.responsabilitytypes);

  }

  //Obtiene distribuidores de UtilidadesAPI
  GetDistributors() {
    return new Promise(async (resolve, reject) => {
      this._dataElementsU
        .getDdataelementU('Distribuidores')
        .then(async (result) => {
          //Desde servicio Utilidades
          let distributors: Array<jsonDistI> = JSON.parse(result.json);
          distributors.sort((a, b) => a.Name.localeCompare(b.Name));
          this.listdist = distributors;
          resolve(true);
        })
        .catch(() => {
          //Lee JSON distribuidores
          this.listdist = [];
          reject();
        });
    });
  }

  //Obtiene Taxschemes
  GetTaxschemes() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('taxschemes').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.taxschemes = JSON.parse(JSON.stringify(data['ResultData']));
            resolve(true);
          } else {
            reject();
          }
        },
        (error) => {
          reject();
        }
      );
    });
  }

  //Obtiene Ciudades
  GetCities() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('cities').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.cityCodes = JSON.parse(JSON.stringify(data['ResultData']));
            resolve(true);
          } else {
            reject();
          }
        },
        (error) => {
          reject();
        }
      );
    });
  }

  //Obtiene Responsabilidades fiscales
  GetResponsabilitytypes() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('responsabilitytypes').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.responsabilitytypes = JSON.parse(JSON.stringify(data['ResultData']));
            resolve(data['ResultData']);
          } else {
            reject();
          }
        },
        (error) => {
          reject();
        }
      );
    });
  }

  exportExcel(): void {
    this._export.exportAsExcelFile(
      this.companiesExcel,
      `CompañíasDiligenciaronFormulario_${this.fechaInicio}_${this.fechaFin}`
    );
  }

  exportJSON(): void {
    this._export.exportAsJSONFile(
      this.companiesExcel,
      `Primera_Emision_Recepcion_${this.fechaInicio}_${this.fechaFin}`
    );
  }


}
