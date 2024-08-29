import { Component, OnInit, HostBinding, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CompanyCreationLog } from 'src/app/models/Company-utilities/company-creation-log';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';

@Component({
  selector: 'app-companies-sent',
  templateUrl: './companies-sent.component.html',
  styleUrls: ['./companies-sent.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CompaniesSentComponent implements OnInit, AfterViewInit {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') companiesLogs: CompanyCreationLog[] = [];

  displayedColumns = ['documentType', 'documentNumber', 'name', 'action'];
  dataSource: MatTableDataSource<CompanyCreationLog>;

  @ViewChild('MatPaginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('sort', { static: false }) sort!: MatSort;

  expandedElement: any;

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];

  constructor(private _AuthorizeCS: AuthorizeCompanyService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => {this.companiesLogs = logs; this.dataSource.data = logs});
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  close(){
    this._AuthorizeCS.changelogCreateCompanies([]);
    this._AuthorizeCS.changemostrar_resultsLog(false);
  }

  distributorName(value : any){
    let id = String(value!);
    let name = this.listdist.find(dist => dist.Id == id)?.Name;
    return (name == undefined ? 'NINGUNO' : name);
  }
}
