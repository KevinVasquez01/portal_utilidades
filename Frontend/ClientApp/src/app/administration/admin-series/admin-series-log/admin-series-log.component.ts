import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, HostBinding, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyCreationLog } from 'src/app/models/Company-utilities/company-creation-log';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';

@Component({
  selector: 'app-admin-series-log',
  templateUrl: './admin-series-log.component.html',
  styleUrls: ['./admin-series-log.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AdminSeriesLogComponent implements OnInit, AfterViewInit {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') companiesLogs: CompanyCreationLog[] = [];

  displayedColumns = ['documentType', 'documentNumber', 'name', 'action'];
  dataSource: MatTableDataSource<CompanyCreationLog>;

  @ViewChild('MatPaginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('sort', { static: false }) sort!: MatSort;

  @Output() exit: EventEmitter<boolean> = new EventEmitter();

  expandedElement: any;

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];

  constructor(private _AuthorizeCS: AuthorizeCompanyService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => { this.companiesLogs = logs; this.dataSource.data = logs });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  close() {
    this.exit.emit(false); //Cierra log
  }

  distributorName(value: any) {
    let id = String(value!);
    let name = this.listdist.find(dist => dist.Id == id)?.Name;
    return (name == undefined ? 'NINGUNO' : name);
  }

}
