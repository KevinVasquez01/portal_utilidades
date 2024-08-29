import { Component, HostBinding, OnInit } from '@angular/core';
import { CompanyCreationLog } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { UpdateDataElementsPRDService } from 'src/app/services/SaphetyApi_PRD/update-data-elements-prd.service';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: [],
})
export class AdminCompaniesComponent implements OnInit {
  //Almacena si se está editando compañía
  @HostBinding('class.is-open') editing = false;
  //Almacena compañías por aprobar
  @HostBinding('class.is-open') companiesPendingtoAuthorize: CompanyR_UC[] = [];
  //Almacena si se muestran resultados de creación
  @HostBinding('class.is-open') companyLogsvisible: boolean = false;

  companiesCreadas: CompanyCreationLog[] = [];

  constructor(
    private _updateDEPRD: UpdateDataElementsPRDService,
    private _toastProvider: ToastProvider,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _userMovement: UserMovementsService
  ) {}

  ngOnInit(): void {
    this._AuthorizeCS.editing.subscribe((edit) => (this.editing = edit));
    this._AuthorizeCS.authCompanies.subscribe(
      (companiestoAuth) => (this.companiesPendingtoAuthorize = companiestoAuth)
    );
    this._AuthorizeCS.mostrar_resultsLog.subscribe(
      (mostrar) => (this.companyLogsvisible = mostrar)
    );

    let ambient = localStorage.getItem('ambient');
    let profile = localStorage.getItem('profile');
    //Valida si ingresa sysAdmin
    if (
      profile == 'Administrator' &&
      (ambient != undefined ? ambient : '') == 'PRD'
    ) {
      setTimeout(() => {
        this._updateDEPRD
          .UpdateDataElements()
          .then(() =>
            this._toastProvider.infoMessage(
              'Se actualizaron Data Elments con éxito.'
            )
          )
          .catch(() =>
            this._toastProvider.dangerMessage(
              'Ocurrió un error al actualizar Data Elments.'
            )
          );
      }, 10000);
    }
  }

  deletefromarray(array: CompanyR_UC[], company: CompanyR_UC): CompanyR_UC[] {
    //Se busca y elimina elemento
    var i = array.indexOf(company);
    if (i !== -1) {
      array.splice(i, 1);
    }
    return array;
  }
}
