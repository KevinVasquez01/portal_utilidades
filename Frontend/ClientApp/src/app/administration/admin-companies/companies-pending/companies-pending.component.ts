import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { TransactionsUI } from 'src/app/models/Transactions-utilities/transaction';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { NotificationsService } from 'src/app/services/UtilidadesAPI/notifications.service';
import { UtilidadesAPIService } from 'src/app/services/UtilidadesAPI/utilidades-api.service';
import { CompanyDialogComponent } from '../../company-dialog/company-dialog.component';

@Component({
  selector: 'app-companies-pending',
  templateUrl: './companies-pending.component.html',
  styleUrls: ['./companies-pending.component.scss'],
})
export class CompaniesPendingComponent implements AfterViewInit, OnInit {
  //Almacena si está editando una compañía
  @HostBinding('class.is-open') Editing = false;
  //Almacena compañías pendientes de accion
  @HostBinding('class.is-open') CompaniesPending: CompanyR_UC[] = [];
  //Almacena compañías por autorizar
  @HostBinding('class.is-open') CompaniestoAuth: CompanyR_UC[] = [];

  displayedColumns = [
    'services',
    'distributorId',
    'documentType',
    'documentNumber',
    'name',
    'actions',
  ];
  dataSource = new MatTableDataSource<CompanyR_UC>(this.CompaniesPending);

  expandedElement: CompanyR_UC = new CompanyR_UC();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() datasaliente: EventEmitter<any> = new EventEmitter();

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];

  constructor(
    private _uAPI: UtilidadesAPIService,
    private _toastProvider: ToastProvider,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _dialog: MatDialog,
    private _dataElementsU: DataElementsService,
    private _NotificationsService: NotificationsService
  ) {}

  updateCOmpanies() {
    this.awaitDataElements().then(() => {
      this._toastProvider.infoMessage('Se actualizaron compañías pendientes.');
    });
  }
  //Espera a que termine de obtener Compañias pendientes
  async awaitDataElements() {
    await this.GetCompaniesPending().then((result) => {
      if (result.length > 0) {
        let arrayFiltrado = result.sort(function (a, b) {
          var dateA = new Date(a.dataCreations[0].date_creation);
          var dateB = new Date(b.dataCreations[0].date_creation);
          return dateA < dateB ? 1 : -1;
        });
        this.CompaniesPending = arrayFiltrado;
        this.dataSource.data = arrayFiltrado;
        this._AuthorizeCS.changePendingCompany(arrayFiltrado);
        this.dataSource.filter = '';
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      } else {
        this.CompaniesPending = [];
        this.dataSource.data = [];
      }
    });
    await this.GetDistributors();
  }
  //Obtiene compañías pendientes
  GetCompaniesPending() {
    return new Promise<CompanyR_UC[]>((resolve, reject) => {
      this._uAPI.GetCompaniesPending().subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          this._toastProvider.dangerMessage(
            'Ocurrió un error al obtener las compañías pendientes: ' +
              JSON.stringify(error)
          );
          reject(error);
        }
      );
    });
  }

  //Obtiene distribuidores de UtilidadesAPI
  GetDistributors() {
    return new Promise((resolve, reject) => {
      this._dataElementsU
        .getDdataelementU('Distribuidores')
        .then((result) => {
          //Desde servicio Utilidades
          this.listdist = JSON.parse(result.json);
          resolve(true);
        })
        .catch(() => {
          this.listdist = [];
          reject();
        });
    });
  }

  ngOnInit(): void {
    this._AuthorizeCS.pendingCompanies_U.subscribe((companies) => {
      this.CompaniesPending = companies;
      this.dataSource.data = companies;
    });

    this._AuthorizeCS.authCompanies.subscribe((companies) => {
      this.CompaniestoAuth = companies;
    });

    this._AuthorizeCS.editing.subscribe((result) => (this.Editing = result));
    this.awaitDataElements();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: any) {
    let filterValue = event?.target?.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendCompanyAthorize(event: any) {
    if (this.Editing) {
      this._toastProvider.cautionMessage(
        'Por favor termine de editar la compañía.'
      );
      return;
    }
    this.CompaniestoAuth.push(event);
    //Envía a listado de compañías para autorizar
    this._AuthorizeCS.changeCtoAuth(this.CompaniestoAuth);

    //nueva lista de compañías pendientes sin la compañía enviada a autorizar
    let arrayFiltrado = this.CompaniesPending.filter(
      (cpend) => !this.CompaniestoAuth.some((cauth) => cauth.id == cpend.id)
    );
    this._AuthorizeCS.changePendingCompany(arrayFiltrado);
  }

  sendCompanyEdit(event: any) {
    //Envía compañía para edición
    this._AuthorizeCS.changeEditingCompany(true, event);
  }

  async transaction_eliminar(company: CompanyR_UC) {
    let cname =
      company.name != ''
        ? company.name
        : `${company.firstname} ${company.middlename} ${company.familyname}`;
    let cnit = `NIT: ${company.documentnumber}-${company.checkdigit}`;

    const dialog = this._dialog.open(CompanyDialogComponent, {
      width: '450px',
      data: {
        titulo: 'Eliminar compañía',
        mensaje: `¿Está seguro de eliminar la compañía: ${cname} ${cnit}?`,
        respuesta: false,
      },
    });
    dialog.afterClosed().subscribe((resp) => {
      if (resp.respuesta) {
        //Envía transacción de eliminación
        this.enviarTransaccion(
          company.documenttype,
          company.documentnumber,
          4,
          'Compañía eliminada'
        ).then(() => {
          var newcompanies = this.CompaniesPending.filter(
            (x) => x.id != company.id
          );
          var companies_pending = newcompanies.filter(
            (cpend) =>
              !this.CompaniestoAuth.some((cauth) => cauth.id == cpend.id)
          );
          this._AuthorizeCS.changePendingCompany(companies_pending);
          this.dataSource.data = companies_pending;

          //Elimina notificaciones asociadas a la empresa
          this._NotificationsService
            .DeleteNotificationsByCompanyDocument(company.documentnumber)
            .finally(() => {
              this._NotificationsService.suscribeActuallyNotificationsForce();
            });
        });
      } else {
        this._toastProvider.infoMessage('Se canceló la operación.');
      }
    });
  }

  enviarTransaccion(
    documentType: string,
    documentNumber: string,
    transactionType: number,
    description: string
  ) {
    return new Promise((resolve, reject) => {
      let document = `${documentType}_${documentNumber}`;
      let transaction: TransactionsUI = {
        company_document: document,
        date: new Date(),
        user:
          localStorage.getItem('user') == null
            ? 'invitado'
            : localStorage.getItem('user') || '',
        transaction_type: transactionType,
        description: description,
      };

      this._uAPI.NewTransaction(transaction).subscribe(
        (data) => {
          this._toastProvider.infoMessage('Se eliminó la compañía.');
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  distributorName(value: any) {
    let id = String(value!);
    let name = this.listdist.find((dist) => dist.Id == id)?.Name;
    return name == undefined ? 'NINGUNO' : name;
  }
}
