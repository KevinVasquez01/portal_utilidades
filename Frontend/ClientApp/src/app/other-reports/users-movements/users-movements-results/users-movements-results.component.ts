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
import { ExportService } from 'src/app/services/export.service';
import { UsersMovements_Excel } from '../users-movements';

@Component({
  selector: 'app-users-movements-results',
  templateUrl: './users-movements-results.component.html',
  styleUrls: ['./users-movements-results.component.scss'],
})
export class UsersMovementsResultsComponent implements OnInit, AfterViewInit {
  @Input() dataEntrante: UsersMovements_Excel[] = []; //Resultados informe
  @Input() nameExcel: string = ''; //Nombre archivo a exportar

  @Output() dataSaliente: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = ['date', 'user', 'component', 'description'];
  dataSource: MatTableDataSource<UsersMovements_Excel> = new MatTableDataSource(
    this.dataEntrante
  );
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    breakpointObserver: BreakpointObserver,
    private _export: ExportService
  ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['date', 'user', 'description']
        : ['date', 'user', 'component', 'description'];
    });
  }

  ngOnInit(): void {
    this.dataSource.data = this.dataEntrante;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportExcel(): void {
    this._export.exportAsExcelFile(this.dataEntrante, this.nameExcel);
  }

  close() {
    this.dataSaliente.emit(false);
  }
}
