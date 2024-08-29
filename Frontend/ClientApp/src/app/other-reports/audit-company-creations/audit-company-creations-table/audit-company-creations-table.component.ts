import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from '../../../services/export.service';
import { AuditCompanyCreationsTable } from 'src/app/models/Audit/AuditCompanyCreations';

@Component({
  selector: 'app-audit-company-creations-table',
  templateUrl: './audit-company-creations-table.component.html',
  styleUrls: ['./audit-company-creations-table.component.scss'],
})
export class AuditCompanyCreationsTableComponent
  implements OnInit, AfterViewInit
{
  displayedColumns = [
    'distributor',
    'documentNumber',
    'name',
    'ambients',
    'services',
    'user',
    'action',
  ];
  dataSource: MatTableDataSource<AuditCompanyCreationsTable> =
    new MatTableDataSource();

  @Input() table: AuditCompanyCreationsTable[] = []; //Primera emisión y recepción
  @Input() nameExcel: string = ''; //Nombre archivo a exportar

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  constructor(breakpointObserver: BreakpointObserver, private _export: ExportService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['date','distributor', 'documentNumber', 'name', 'action']
        : [
            'date',
            'distributor',
            'documentNumber',
            'name',
            'ambients',
            'services',
            'user',
            'action',
          ];
    });
  }

  ngOnInit(): void {
    this.dataSource.data = this.table;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  actionText(action: string) {
    if (action.toLocaleLowerCase().includes('qa')) {
      return 'blue';
    } else if (action.toLocaleLowerCase().includes('prd')) {
      return 'orange';
    } else if (action.toLocaleLowerCase().includes('eliminada')) {
      return 'red';
    } else {
      return 'black';
    }
  }

  cutUser(user: string){
    let toreturn = '';
    let split = user.split('@');
    for(let i =0; i<split[0].length; i++){
      toreturn +=  toreturn.length % 20 == 0 ? ` ${split[0][i]}` : split[0][i];
    }
    return toreturn;
  }

  exportExcel(): void {
    this._export.exportAsExcelFile(this.table, this.nameExcel.split('-').join(''));
  }
}
