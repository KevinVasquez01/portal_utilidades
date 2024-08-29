import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseI } from 'src/app/models/response.interface';
import { CompanyS_I } from 'src/app/models/SearchCompany/searchCompany';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { SearchCompanyQaService } from 'src/app/services/SaphetyApi_QA/search-company-qa.service';

interface Voperator {
  Id: string;
  Alias: string;
  Name: string;
}

@Component({
  selector: 'app-search-company',
  templateUrl: './search-company.component.html',
  styleUrls: ['./search-company.component.css'],
})
export class SearchCompanyComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() tittle: string = '';
  @Input() subtittle: string = '';
  @Input() buttontooltip: string = '';
  @Input() showClosebutton: boolean = true;
  @Input() showNotifications: boolean = true;

  @Output() datasaliente: EventEmitter<CompanyS_I[]> = new EventEmitter();
  @Output() closesaliente: EventEmitter<boolean> = new EventEmitter();

  companies_to_add: CompanyS_I[] = [];

  opvs: Voperator[] = [];
  opvSelected: Voperator = { Id: '', Alias: '', Name: '' };
  selected_opv = this.opvs;
  selected_opvalue = ''; //alias virtual operator
  selected_opvalueId = ''; //id virtual operator
  ambiente: any;

  CompanySearchnit = '';
  CompanySearchname = '';

  displayedColumns = ['services', 'documentNumber', 'name', 'actions'];
  dataSource = new MatTableDataSource<CompanyS_I>([]);

  constructor(
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _toastProvider: ToastProvider,
    private _SearchCompanyQA: SearchCompanyQaService,
    private _SearchCompanyPRD: SearchCompanyPrdService
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
    this.awaitVirtualOperators();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  changeOperator(event: any) {
    var operatorselected = this.opvs.find((x) => x.Alias == event);
    if (operatorselected != undefined) {
      this.selected_opvalueId = operatorselected!.Id;
      this.selected_opvalue = operatorselected!.Alias;
    }
  }

  defaultOperator() {
    var operatorselected = this.opvs.find((x) => x.Alias == 'saphety');
    if (operatorselected != undefined) {
      this.opvSelected = operatorselected;
      this.changeOperator(operatorselected.Alias);
    }
  }

  // Operadores virtuales
  onKey_opv(event: any) {
    this.selected_opv = this.search_opv(event.target.value);
  }

  search_opv(value: string) {
    let filter = value.toLowerCase();
    return this.opvs.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }

  //Espera a que termine de obtener operadores virtuales
  async awaitVirtualOperators() {
    const toastProvider_Function = this._toastProvider;
    await this.getVirtualOperators()
      .finally(() => {
        this.defaultOperator();
      })
      .catch((result: any) => {
        toastProvider_Function.dangerMessage(
          `Ocurrió un error al obtener los operadores virtuales ${JSON.stringify(
            result
          )}`
        );
      });
  }

  //Operadores
  getVirtualOperators() {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        let body: findvirtualoperatorI = {
          Id: '',
          SortField: '-CreationDate',
          Alias: '',
        };
        this._getGetDataPRD.GetVirtualOperators(body).subscribe(
          (data) => {
            let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
            if (dataRespomnsive?.IsValid) {
              let operadores: Voperator[] = JSON.parse(
                JSON.stringify(dataRespomnsive?.ResultData)
              );
              //Agrego operadores a lista
              operadores.forEach((x) =>
                this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name })
              );
              resolve(operadores);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['ResultData']);
          }
        );
      } else if (this.ambiente == 'QA') {
        let body: findvirtualoperatorI = {
          Id: '',
          SortField: '-CreationDate',
          Alias: '',
        };
        this._getGetDataQA.GetVirtualOperators(body).subscribe(
          (data) => {
            let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
            if (dataRespomnsive?.IsValid) {
              let operadores: Voperator[] = JSON.parse(
                JSON.stringify(dataRespomnsive?.ResultData)
              );
              //Agrego operadores a lista
              operadores.forEach((x) =>
                this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name })
              );
              resolve(operadores);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['ResultData']);
          }
        );
      }
    });
  }

  newDataSource(data: CompanyS_I[]) {
    this.dataSource.data = data;
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  close() {
    this.closesaliente.emit(true);
  }

  addcompany(event: CompanyS_I) {
    if (
      !this.companies_to_add.some(
        (x) =>
          x.Identification.DocumentNumber == event.Identification.DocumentNumber
      )
    ) {
      event.SelectedOPVName = this.selected_opvalue;
      this.companies_to_add.push(event);
      this.datasaliente.emit(this.companies_to_add);
      if(this.showNotifications){
        this._toastProvider.infoMessage('Se agregó compañía');
      }
    } else {
      if(this.showNotifications){
      this._toastProvider.cautionMessage('Compañía ya fue agregada');
      }
    }
  }

  //Obtener listado compañías
  SearhCompany() {
    if (this.CompanySearchnit == '' && this.CompanySearchname == '') {
      this._toastProvider.cautionMessage('Por favor digite un Nombre o NIT');
      return;
    }
    if (this.ambiente == 'PRD') {
      this._SearchCompanyPRD
        .SearchCompanies(
          this.selected_opvalue,
          this.CompanySearchnit,
          this.CompanySearchname
        )
        .then((data) => {
          this.newDataSource(JSON.parse(JSON.stringify(data)));
        })
        .catch((error) => {
          this._toastProvider.dangerMessage(
            `Ocurrió un error al obtener empresas ${JSON.stringify(error)}`
          );
        });
    } else if (this.ambiente == 'QA') {
      this._SearchCompanyQA
        .SearchCompanies(
          this.selected_opvalue,
          this.CompanySearchnit,
          this.CompanySearchname
        )
        .then((data) => {
          this.newDataSource(JSON.parse(JSON.stringify(data)));
        })
        .catch((error) => {
          this._toastProvider.dangerMessage(
            `Ocurrió un error al obtener empresas ${JSON.stringify(error)}`
          );
        });
    }
  }
}
