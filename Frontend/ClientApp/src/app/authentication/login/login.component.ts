import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { ResponseI } from 'src/app/models/response.interface';
import { LoginI } from 'src/app/models/login.interface';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitted = false;
  ambient: string = '';
  body: any;
  email: string = '';

  public errorDanger: boolean = false;
  public getError: any;
  logged = false;
  usuario = '';

  // Hide password
  hide = true;

  @HostBinding('class.is-open') isLogin = false;

  public form: FormGroup = Object.create(null);
  constructor(
    private _auth: AuthService,
    private sideBarService: SideBarService,
    private fb: FormBuilder,
    private _router: Router,
    private _dataElments: DataElementsService,
    private _toastProvider: ToastProvider,
    private _userMovement: UserMovementsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      virtualoperator: [''],
      ambient: ['', Validators.required],
    });
    this.sideBarService.customMessage.subscribe((msg) => (this.logged = msg));
  }

  async onLogin() {
    //Limpia localStorage
    localStorage.clear();

    this.isLogin = true;
    let uname = this.form.controls['uname'].value;
    this.email = String(uname);
    let password = this.form.controls['password'].value;
    let operator = this.form.controls['virtualoperator'].value;
    let ambient = this.form.controls['ambient'].value;

    await this.getToken(uname, password, operator, ambient)
      .then(async (dataRespomnsive) => {
        if (dataRespomnsive.IsValid) {
          await this._dataElments.getProfileU(uname).then((profile) => {
            if (profile != '') {
              localStorage.setItem('profile', profile);
            }
          });

          await this.checkUser(ambient).finally(() => {
            this._router.navigate(['/']);
          });

          let vOperator = localStorage.getItem('operator') || '';

          this._toastProvider.successMessage(
            `Ha iniciado sesión correctamente en ambiente de ${
              localStorage.getItem('ambient') == 'QA'
                ? 'pruebas (QA).'
                : 'producción (PRD).'
            }` + `${vOperator.length === 0 ? '' : ` Operador: ${vOperator}`}`
          );

          let userfullname = localStorage.getItem('userfullname');
          let profile = localStorage.getItem('profile');
          this.sideBarService.changeStatus(
            true,
            userfullname != undefined ? userfullname : '',
            profile != undefined ? profile : ''
          );

          //Notifica movimiento Inicio de sesión
          this._userMovement.NewUsersMovement(
            'Inicio de sesión',
            'authentication/login'
          );
        } else {
          this._toastProvider.dangerMessage(
            'Datos no válidos, por favor corríjalos, e intente nuevamente.'
          );
          this.sideBarService.changeStatus(false, '', '');
        }
      })
      .catch(() => {
        this._toastProvider.infoMessage(
          'Datos no válidos, por favor corríjalos, e intente nuevamente.'
        );
        this.sideBarService.changeStatus(false, '', '');
      });
  }

  getToken(uname: string, password: string, operator: string, ambient: string) {
    return new Promise<ResponseI>((resolve, reject) => {
      let body: LoginI = {
        userName: uname,
        password: password,
        virtual_operator: operator,
      };

      this._auth.GetToken(body, ambient).subscribe(
        (data) => {
          let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
          if (dataRespomnsive?.IsValid) {
            localStorage.setItem('user', uname);
            localStorage.setItem(
              'operator',
              dataRespomnsive.ResultData.virtual_operator_alias === null
                ? ''
                : dataRespomnsive.ResultData.virtual_operator_alias
            );

            localStorage.setItem(
              'token',
              dataRespomnsive.ResultData?.access_token
            );
            localStorage.setItem(
              'expires',
              dataRespomnsive.ResultData?.expires.toString()
            );
            localStorage.setItem('logindate', new Date().toString());
            localStorage.setItem('ambient', ambient);

            resolve(dataRespomnsive);
          } else {
            reject(dataRespomnsive);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  checkUser(ambient: string) {
    return new Promise((resolve, reject) => {
      this._auth.CheckUser(ambient).subscribe(
        (data) => {
          if (data['IsValid']) {
            let perfil = localStorage.getItem('profile');
            if (perfil === null) {
              let rol: Array<any> = data['ResultData']?.['SystemMemberships'];
              rol.forEach((x) => {
                if (x['SystemRoleName'] == '') {
                  localStorage.setItem('profile', x['SystemRoleName']);
                }
              });
            }

            let fullName: string = data['ResultData']?.['Name'];
            let fullnameSplit = fullName.split(' ', 3);
            if (fullnameSplit.length > 2) {
              localStorage.setItem(
                'userfullname',
                fullnameSplit[0] + ' ' + fullnameSplit[2]
              );
            } else {
              localStorage.setItem(
                'userfullname',
                data['ResultData']?.['Name']
              );
            }

            let userfullname = localStorage.getItem('userfullname');
            let profile = localStorage.getItem('profile');
            this.sideBarService.changeStatus(
              true,
              userfullname != undefined ? userfullname : '',
              profile != undefined ? profile : ''
            );
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }
}
