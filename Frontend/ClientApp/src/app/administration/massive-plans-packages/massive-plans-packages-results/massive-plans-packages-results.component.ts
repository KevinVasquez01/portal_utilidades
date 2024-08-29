import { BreakpointObserver } from '@angular/cdk/layout';
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
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  PlanPackage_Companies_Log,
  PlanPackage_logs,
} from 'src/app/models/PackagesPRD/massiveplanspackages';
import { ExportService } from '../../export.service';

interface show {
  OV: string;
  Nombre: string;
  Documento: string;
  date: Date;
  module: string;
  message: string;
  status: boolean;
}

@Component({
  selector: 'app-massive-plans-packages-results',
  templateUrl: './massive-plans-packages-results.component.html',
  styleUrls: ['./massive-plans-packages-results.component.scss'],
})
export class MassivePlansPackagesResultsComponent implements AfterViewInit, OnInit {
  @Input() data: PlanPackage_Companies_Log[] = [];

  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<PlanPackage_logs> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor(breakpointObserver: BreakpointObserver, private _export: ExportService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['date', 'Empresa']
        : ['date', 'Empresa', 'module', 'message', 'status'];
    });
  }
  ngOnInit(): void {
    this.dataSource.data = [];
    let toShowData: Array<show> = [];
    this.data.forEach((element) => {
      let companyName =
        element.company_saphety?.Name != ''
          ? element.company_saphety?.Name
          : `${element.company_saphety?.Person.FirstName} ${element.company_saphety?.Person.FamilyName}`;

      for (let i = 0; i < element.log.length; i++) {
        let toShow: show = {
          OV: element.company_excel.Alias_Operador_Virtual,
          Nombre: companyName != undefined ? companyName : '',
          Documento: element.company_saphety?.Identification.DocumentNumber + '',
          date: element.log[i].date,
          module: element.log[i].module,
          message: element.log[i].message,
          status: element.log[i].status,
        };
        toShowData.push(toShow);
      }
    });
    this.dataSource.data = toShowData;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  excel() {
    //Resultados
    this._export.exportAsExcelFile(
      this.dataSource.data,
      'Compañias_PlanesPaquetes_Resultados'
    );
  }

  closeAction() {
    this.close.emit(true);
  }
}
