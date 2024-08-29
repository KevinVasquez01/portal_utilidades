import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { UtilidadesAPIService } from 'src/app/services/UtilidadesAPI/utilidades-api.service';
import { Company_UI } from 'src/app/models/Company-utilities/company';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { TransactionsUI } from 'src/app/models/Transactions-utilities/transaction';
import { Router } from '@angular/router';
import { NotificationsService } from '../services/UtilidadesAPI/notifications.service';
import { Notifications } from '../models/Notifications/notifications';
import { ToastProvider } from '../notifications/toast/toast.provider';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.scss'],
})
export class CreateCompanyComponent implements OnInit {
  //Almacena compañía
  @HostBinding('class.is-open') companytoCreate: CompanyR_UC =
    new CompanyR_UC();

  company!: Company_UI;
  companyInformation: FormGroup = new FormGroup({});
  companyContact: FormGroup = new FormGroup({});
  companyResponsabilities: FormGroup = new FormGroup({});
  companySeries: FormGroup = new FormGroup({});
  companyOther: FormGroup = new FormGroup({});
  companyUser: FormGroup = new FormGroup({});
  isEditable = true;
  iscreated = false;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _uAPI: UtilidadesAPIService,
    private _toastProvider: ToastProvider,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _NotificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this._AuthorizeCS.currentCompany.subscribe(
      (company) => (this.companytoCreate = company)
    );

    this.companyInformation = this._formBuilder.group({
      company: ['', Validators.required],
      dataCreations: ['', Validators.required],
    });
    this.companyContact = this._formBuilder.group({
      json: ['', Validators.required],
    });
    this.companyOther = this._formBuilder.group({
      responsabilityTypes: ['', Validators.required],
      companySeries: ['', Validators.required],
    });
    this.companyUser = this._formBuilder.group({
      users: ['', Validators.required],
    });
  }

  //Datos recibidos Company Information
  reseiveCompanyInformation(stepper: MatStepper) {
    this.companyInformation.setValue({ company: true, dataCreations: true });
    stepper.next();
  }

  //Datos recibidos Company Contact
  reseiveCompanyContact(next: boolean, stepper: MatStepper) {
    if (!next) {
      stepper.previous();
    } else {
      this.companyContact.setValue({ json: true });
      stepper.next();
    }
  }

  //Datos recibidos Company Other
  reseiveCompanyOther(next: boolean, stepper: MatStepper) {
    if (!next) {
      stepper.previous();
    } else {
      this.companyOther.setValue({
        responsabilityTypes: true,
        companySeries: true,
      });
      stepper.next();
    }
  }

  //Datos recibidos Company User
  reseiveCompanyUser(next: boolean, stepper: MatStepper) {
    if (!next) {
      stepper.previous();
    } else {
      this.companyUser.setValue({ users: true });
      stepper.next();
    }
  }

  sendNotifications(creation: boolean, company: CompanyR_UC) {
    let now = new Date();
    let date = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      )
    );

    let notifications: Array<Notifications> = [
      {
        date: date,
        round: creation ? 'round-success' : 'round-info',
        icon: creation ? 'ti-pencil-alt' : 'ti-pencil',
        notification: creation ? '¡Nueva empresa!' : '¡Empresa Actualizada!',
        text1:
          company.name !== ''
            ? company.name
            : `${company.firstname} ${company.familyname}`,
        text2: `${company.documenttype} ${company.documentnumber}-${company.checkdigit}`,
        url: '/administration/admin-companies',
        profile: 'administrator',
        show: true,
      },
      {
        date: date,
        round: creation ? 'round-success' : 'round-info',
        icon: creation ? 'ti-pencil-alt' : 'ti-pencil',
        notification: creation ? '¡Nueva empresa!' : '¡Empresa Actualizada!',
        text1:
          company.name !== ''
            ? company.name
            : `${company.firstname} ${company.familyname}`,
        text2: `${company.documenttype} ${company.documentnumber}-${company.checkdigit}`,
        url: '/administration/admin-companies',
        profile: 'consultant',
        show: true,
      },
    ];

    //Envia notificación creación de empresa
    this._NotificationsService.NewNotifications(notifications);
  }

  SearchCompany() {
    this._uAPI
      .SearchCompany(
        `${this.companytoCreate.documenttype}_${this.companytoCreate.documentnumber}`
      )
      .subscribe(
        (response) => {
          let dataRespomnsive: any = response;
          if (dataRespomnsive.length > 0) {
            //Actualizar compañía
            this.companytoCreate.id = dataRespomnsive[0]?.id;
            this.UpdateCompany();

            //Envía transacción de actualización
            var update = {
              before: dataRespomnsive[0],
              after: this.companytoCreate,
            };
            this.SendTransaccion(
              this.companytoCreate.documenttype,
              this.companytoCreate.documentnumber,
              1,
              JSON.stringify(update)
            );
            //Modifica transacciones de Eliminación y envío de compañía
            this.DeleteTransaction();
            //Envia notificación actualización de empresa
            this.sendNotifications(false, this.companytoCreate);
          } else {
            //Enviar nueva empresa
            this.SentCompanytoAPI();
            //Envia notificación creación de empresa
            this.sendNotifications(true, this.companytoCreate);
          }
        },
        (error) => {
          this._toastProvider.cautionMessage(
            'Los datos no pudieron ser enviados, por favor comuníquese con el consultor.'
          );
          //console.log(error);
        }
      );
  }

  SentCompanytoAPI() {
    this._uAPI.NewCompany(this.companytoCreate).subscribe(
      (response) => {
        let dataRespomnsive: any = response;
        if (dataRespomnsive?.id) {
          this._toastProvider.successMessage('Los datos fueron enviados.');
          this.iscreated = true;
          this.companytoCreate = new CompanyR_UC();
          this.companyInformation.reset();
          this.companyContact.reset();
          this.companyResponsabilities.reset();
          this.companyUser.reset();
        } else {
          this._toastProvider.cautionMessage(
            'Los datos no pudieron ser enviados, por favor comuníquese con el consultor.'
          );
        }
      },
      (error) => {
        if (error?.error?.message) {
          this._toastProvider.cautionMessage(
            error?.error?.message + ', por favor comuníquese con el consultor'
          );
        } else {
          this._toastProvider.cautionMessage(
            'Los datos no pudieron ser enviados, por favor comuníquese con el consultor.'
          );
        }
      }
    );
  }

  UpdateCompany() {
    this._uAPI.UpdateCompany(this.companytoCreate).subscribe(
      (response) => {
        let dataRespomnsive: any = response;
        if (dataRespomnsive?.value) {
          this._toastProvider.successMessage('Los datos fueron enviados.');
          this.iscreated = true;
          this.companytoCreate = new CompanyR_UC();
          this.companyInformation.reset();
          this.companyContact.reset();
          this.companyResponsabilities.reset();
          this.companyUser.reset();
        } else {
          this._toastProvider.cautionMessage(
            'Los datos no pudieron ser enviados, por favor comuníquese con el consultor.'
          );
        }
      },
      (error) => {
        if (error?.error?.message) {
          this._toastProvider.cautionMessage(
            error?.error?.message + ', por favor comuníquese con el consultor'
          );
        } else {
          this._toastProvider.cautionMessage(
            'Los datos no pudieron ser enviados, por favor comuníquese con el consultor.'
          );
        }
      }
    );
  }

  DeleteTransaction() {
    this._uAPI
      .Transactions_Delete(
        `${this.companytoCreate.documenttype}_${this.companytoCreate.documentnumber}`
      )
      .subscribe((data) => {});
  }

  Clear() {
    this.iscreated = false;
  }

  SendTransaccion(
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
        user: 'Invitado',
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

  Exit() {
    this._router.navigate(['/']);
  }
}
