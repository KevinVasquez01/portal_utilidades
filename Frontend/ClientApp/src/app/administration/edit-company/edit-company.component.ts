import {
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
} from '@angular/core';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { TransactionsUI } from 'src/app/models/Transactions-utilities/transaction';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { UtilidadesAPIService } from 'src/app/services/UtilidadesAPI/utilidades-api.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: [],
})
export class EditCompanyComponent implements OnInit {
  //Almacena compañía a editar
  @HostBinding('class.is-open') companytoEdit: CompanyR_UC = new CompanyR_UC();
  datosprevios!: CompanyR_UC;
  cname_toShow = '';
  cnit_toShow = '';

  companiesPendingtoSend: CompanyR_UC[] = [];
  company: CompanyR_UC = new CompanyR_UC();
  update = false;

  @Output() datasaliente: EventEmitter<any> = new EventEmitter();

  constructor(
    private _uAPI: UtilidadesAPIService,
    private _toastProvider: ToastProvider,
    private _AuthorizeCS: AuthorizeCompanyService
  ) {}

  ngOnInit(): void {
    this._AuthorizeCS.currentCompany.subscribe(
      (company) => (this.companytoEdit = company)
    );
    this.cname_toShow =
      this.companytoEdit.name != ''
        ? this.companytoEdit.name
        : `${this.companytoEdit.firstname} ${this.companytoEdit.middlename} ${this.companytoEdit.familyname}`;
    this.cnit_toShow = `NIT: ${this.companytoEdit.documentnumber}-${this.companytoEdit.checkdigit}`;
    this.datosprevios = JSON.parse(JSON.stringify(this.companytoEdit));
  }

  cancelEdition() {
    this._AuthorizeCS.changeEditingCompany(false, new CompanyR_UC());
    this.datasaliente.emit(false);
  }

  sendEdition() {
    this.editCompany();
    this.transaction();
  }

  async editCompany() {
    await this.UpdateCompanyAPI();
  }

  UpdateCompanyAPI() {
    return new Promise((resolve, reject) => {
      this._uAPI.UpdateCompany(this.companytoEdit).subscribe(
        () => {
          this._toastProvider.successMessage('Los datos fueron actualizados.');

          this._AuthorizeCS.changeEditingCompany(false, new CompanyR_UC());
          this.datasaliente.emit(true);

          resolve(true);
        },
        (error) => {
          this._toastProvider.dangerMessage(
            'Los datos no pudieron ser actualizados.' + JSON.stringify(error)
          );
          reject();
        }
      );
    });
  }

  async transaction() {
    //Envía transacción de actualización
    var update = { before: this.datosprevios, after: this.companytoEdit };
    await this.enviarTransaccion(
      this.companytoEdit.documenttype,
      this.companytoEdit.documentnumber,
      1,
      JSON.stringify(update)
    );
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
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
