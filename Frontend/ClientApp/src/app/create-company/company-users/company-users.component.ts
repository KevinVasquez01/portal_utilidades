import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipList } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { CompanyUsers_U } from 'src/app/models/Company-utilities/company-users';
import {
  CompanyMemberships_SaphetyI,
  CompanyUsers_Saphety,
  Roles_SaphetyI,
} from 'src/app/models/Company/Users';
import {
  companyRoles,
  companyRoles_Description,
} from 'src/app/models/dataElmenets-utilities/company-roles-utilities';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { CompanyUsersDialogComponent } from './company-users-dialog/company-users-dialog.component';

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.scss'],
})
export class CompanyUsersComponent implements OnInit {
  @ViewChild('chipList')
  chipList!: MatChipList;

  @Output() datasaliente: EventEmitter<any> = new EventEmitter();

  //Alerta permisos no seleccionados
  permSelection = true;

  FormGroup: FormGroup = new FormGroup({});

  //CompanyRoles
  CompanyRoles: Array<companyRoles> = [];
  CompanyRoles_Description: Array<companyRoles_Description> = [];

  //Roles seleccionados
  CompanyRoles_selected: Array<companyRoles> = [];

  //Usuario que se va a crear
  companyUsers_toAdd!: CompanyUsers_Saphety;

  //Almacena si se está editando compañía
  @HostBinding('class.is-open') editing = false;
  //Almacena compañía a editar
  @HostBinding('class.is-open') companytoEdit: CompanyR_UC = new CompanyR_UC();

  constructor(
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _dataElementsU: DataElementsService,
    private _toastProvider: ToastProvider,
  ) {}

  async ngOnInit(): Promise<void> {
    this.FormGroup = this._formBuilder.group({
      companyUser: this._formBuilder.group({
        name: ['', Validators.required],
        emailuser: ['', [Validators.required, Validators.email]],
        telephone: ['', Validators.required],
      }),
    });

    this._AuthorizeCS.editing.subscribe((edit) => (this.editing = edit));
    this._AuthorizeCS.currentCompany.subscribe((company) => {
      this.companytoEdit = company;
      this.selectUser();
    });

    //Obtiene companyRoles_Description de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('companyRoles_Description')
      .then((result) => {
        //Desde servicio Utilidades
        this.CompanyRoles_Description = JSON.parse(result.json);
      })
      .catch(() => {
        this.CompanyRoles_Description = [];
      });

    //Obtiene companyRoles de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('companyRoles')
      .then((result) => {
        //Desde servicio Utilidades
        let companyRoles: Array<companyRoles> = JSON.parse(result.json);
        companyRoles.sort((a, b) => {
          let name_a = a.Name_Spanish;
          let name_b = b.Name_Spanish;

          if (name_a < name_b) return -1;
          if (name_a > name_b) return 1;
          return 0;
        });

        this.CompanyRoles = companyRoles;
      })
      .catch(() => {
        this.CompanyRoles = [];
      });

    let companyUser: CompanyUsers_U = new CompanyUsers_U();
    if (this.editing) {
      companyUser = this.companytoEdit.users[0];
      this.companytoEdit.users.forEach((user) => {
        let adduser: CompanyUsers_Saphety = new CompanyUsers_Saphety();
        adduser.Name = user.name;
        adduser.Email = user.email;
        adduser.Telephone = user.telephone;
        adduser.IsBlocked = user.isblocked;
        adduser.Timezone = user.timezone;
        adduser.LanguageCode = user.languagecode;
        adduser.CompanyMemberships = JSON.parse(user.companymemberships);
        this.companyUsers_toAdd = adduser;
      });
      let roles =
        this.companyUsers_toAdd != undefined
          ? this.companyUsers_toAdd.CompanyMemberships.length > 0
            ? this.companyUsers_toAdd.CompanyMemberships[0].Roles
            : []
          : [];
      if (roles.length > 0) {
        this.CompanyRoles_selected = [];
        roles.forEach((x) => {
          let CompanyRol = this.CompanyRoles.find(
            (y) => y.Name == x.CompanyRoleName
          );
          if (CompanyRol != undefined) {
            this.CompanyRoles_selected.push(CompanyRol);
          }
        });
      } else {
        this.selectUser();
      }

      this.FormGroup = this._formBuilder.group({
        companyUser: this._formBuilder.group({
          name: [
            this.companyUsers_toAdd != undefined
              ? this.companyUsers_toAdd!.Name
              : '',
            Validators.required,
          ],
          emailuser: [
            this.companyUsers_toAdd != undefined
              ? this.companyUsers_toAdd!.Email
              : '',
            [Validators.required, Validators.email],
          ],
          telephone: [
            this.companyUsers_toAdd != undefined
              ? this.companyUsers_toAdd!.Telephone
              : '',
            Validators.required,
          ],
        }),
      });
    }
  }

  //Filtrar permisos por servicio seleccionado --pendiente
  selectUser() {
    this.CompanyRoles_selected = [];
    let salesinvoice =
      this.companytoEdit.dataCreations.length > 0
        ? this.companytoEdit.dataCreations[0]!.salesinvoice_included
        : false;
    let payrroll =
      this.companytoEdit.dataCreations.length > 0
        ? this.companytoEdit.dataCreations[0]!.payrroll_included
        : false;

    let filtroFV: Array<string> = [
      'Company Administrator',
      'Issuer',
      'Receiver',
    ];
    let filtroNE: Array<string> = [
      'Company Administrator',
      'Payroll Issuer',
      'Payroll Viewer',
    ];
    let rolesFV = this.CompanyRoles.filter(
      (x) => x.Name == filtroFV.find((y) => y == x.Name || '')
    );
    let rolesNE = this.CompanyRoles.filter(
      (x) => x.Name == filtroNE.find((y) => y == x.Name || '')
    );

    //Factura y Nomina
    if (salesinvoice && payrroll) {
      rolesFV.forEach((x) => {
        let found = this.CompanyRoles_selected.find((y) => y.Name == x.Name);
        if (found == undefined) {
          this.CompanyRoles_selected.push(x);
        }
      });

      rolesNE.forEach((x) => {
        let found = this.CompanyRoles_selected.find((y) => y.Name == x.Name);
        if (found == undefined) {
          this.CompanyRoles_selected.push(x);
        }
      });
    }
    //Nomina
    else if (payrroll) {
      rolesNE.forEach((x) => {
        let found = this.CompanyRoles_selected.find((y) => y.Name == x.Name);
        if (found == undefined) {
          this.CompanyRoles_selected.push(x);
        }
      });
    }
    //Factura
    else {
      rolesFV.forEach((x) => {
        let found = this.CompanyRoles_selected.find((y) => y.Name == x.Name);
        if (found == undefined) {
          this.CompanyRoles_selected.push(x);
        }
      });
    }
  }

  armarUser() {
    return new Promise((resolve) => {
      let newcompanyUser: CompanyUsers_Saphety = new CompanyUsers_Saphety();
      let companyUser = this.FormGroup.controls.companyUser.value;
      newcompanyUser.Name = companyUser['name'];
      newcompanyUser.Email = companyUser['emailuser'];
      newcompanyUser.Telephone = companyUser['telephone'];
      newcompanyUser.CompanyMemberships = [];

      this.CompanyRoles_selected.forEach((x) => {
        if (newcompanyUser.CompanyMemberships.length == 0) {
          let newCompanyMemberships: CompanyMemberships_SaphetyI =
            new CompanyMemberships_SaphetyI();
          let newrol: Roles_SaphetyI = {
            CompanyRoleId: x.Id,
            CompanyRoleName: x.Name,
          };
          newCompanyMemberships.Roles.push(newrol);
          newcompanyUser.CompanyMemberships.push(newCompanyMemberships);
        } else {
          let existCompanyMemberships = newcompanyUser.CompanyMemberships[0];
          let newrol: Roles_SaphetyI = {
            CompanyRoleId: x.Id,
            CompanyRoleName: x.Name,
          };
          existCompanyMemberships.Roles.push(newrol);
          newcompanyUser.CompanyMemberships = [existCompanyMemberships];
        }
      });

      //Usuario que será enviado
      this.companyUsers_toAdd = newcompanyUser;

      resolve(true);
    });
  }

  async onSubmit(next: boolean) {
    if (!next) {
      this.datasaliente.emit(next);
    } else {
      if (this.FormGroup.invalid) {
        return;
      }
      await this.armarUser();

      this.companytoEdit.users = [];
      let newcompanyUser: CompanyUsers_U = new CompanyUsers_U();
      newcompanyUser.companymemberships = JSON.stringify(
        this.companyUsers_toAdd.CompanyMemberships
      );
      newcompanyUser.name = this.companyUsers_toAdd.Name;
      newcompanyUser.email = this.companyUsers_toAdd.Email;
      newcompanyUser.telephone = this.companyUsers_toAdd.Telephone;
      this.companytoEdit.users.push(newcompanyUser);

      this._AuthorizeCS.changeEditingCompany(this.editing, this.companytoEdit);
      this.datasaliente.emit(next);

      if (this.editing) {
        this._toastProvider.infoMessage('Datos actualizados.');
      }
    }
  }

  onSelectedChips() {
    setTimeout(() => {
      this.CompanyRoles_selected = [];
      this.chipList.chips.forEach((element) =>
        this.validateStatus(element.value, element.selected)
      );

      if (this.CompanyRoles_selected.length > 0) {
        this.permSelection = true;
      } else {
        this.permSelection = false;
      }
    }, 500);
  }

  validateStatus(id: string, status: boolean) {
    let item = this.CompanyRoles.find((x) => x.Id == id);
    if (item != undefined && status) {
      this.CompanyRoles_selected.push(item);
    }
  }

  CompanyRol_description_show(Name_Spanish: string) {
    let description = this.CompanyRoles_Description.find(
      (x) => x.Name == Name_Spanish
    );
    if (description != undefined) {
      this.dialog.open(CompanyUsersDialogComponent, {
        data: description,
      });
    }
  }

  imageUser(roles: companyRoles, image: boolean) {
    let user_description = this.CompanyRoles.find((x) => x.Name == roles.Name);
    if (image) {
      let newuser = this.CompanyRoles_Description.find(
        (x) => x.Name == user_description?.Name_Spanish
      );
      return newuser?.Image || '';
    } else {
      return user_description?.Name_Spanish || '';
    }
  }
}
