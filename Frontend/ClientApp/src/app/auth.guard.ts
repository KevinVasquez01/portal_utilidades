import { Injectable, OnInit } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { ToastProvider } from './notifications/toast/toast.provider';
import { AuthService } from './services/auth.service';
import { SideBarService } from './services/side-bar.service';
import { UserMovementsService } from './services/UtilidadesAPI/user-movements.service';
import { MenuItems } from './shared/menu-items/menu-items';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnInit {
  constructor(
    public menuItems: MenuItems,
    private _routes: Router,
    private _authservice: AuthService,
    private _toastProvider: ToastProvider,
    private _sideBarService: SideBarService,
    private _userMovement: UserMovementsService
  ) {}

  currentmodule = '';
  ngOnInit(): void {
    this._sideBarService.currentmodule.subscribe(
      (cmodule) => (this.currentmodule = cmodule)
    );
  }

  chektoken() {
    return new Promise<boolean>((result, reject) => {
      let ambient = localStorage.getItem('ambient');
      this._authservice
        .CheckUser(ambient != undefined ? ambient : '')
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              result(true);
            } else {
              reject(false);
            }
          },
          () => {
            reject(false);
          }
        );
    });
  }

  validateProfile(
    profile: string[] | undefined,
    ambient: string | undefined
  ): boolean {
    if (ambient != undefined) {
      if (ambient != localStorage.getItem('ambient')) {
        return false;
      }
    }

    if (profile != undefined) {
      let perfil = localStorage.getItem('profile');
      let find = profile.find(
        (x) => x === (perfil != undefined ? perfil : '*')
      );
      if (find != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  async canActivate_module(module: string) {
    let toReturn = false;
    await Promise.all(
      this.menuItems.getMenuitem().map(async (menu) => {
        if (menu.state === module) {
          toReturn = this.validateProfile(menu.profile, menu.ambient);
          return toReturn;
        } else if (menu.children != undefined) {
          await Promise.all(
            menu.children?.map(async (menu_children) => {
              if (menu_children.state === module) {
                toReturn = this.validateProfile(
                  menu_children.profile,
                  menu_children.ambient
                );
                return toReturn;
              } else if (menu_children.subchildren != undefined) {
                await Promise.all(
                  menu_children.subchildren?.map(
                    async (menu_children_child) => {
                      if (menu_children_child.state === module) {
                        toReturn = this.validateProfile(
                          menu_children_child.profile,
                          menu_children_child.ambient
                        );
                        return toReturn;
                      }
                    }
                  )
                );
              }
            })
          );
        }
      })
    );
    if (!toReturn) {
      this._routes.navigate(['/']);
    }
    return toReturn;
  }

  async isLogued() {
    if (localStorage.getItem('token') != null) {
      let expires = localStorage.getItem('expires');
      const expiredate = new Date(
        expires != null ? expires : new Date().toString()
      );

      //Calcular horas restantes para vencimiento Token
      let diferencia = expiredate.getTime() - new Date().getTime();
      let horas_al_vencimiento = diferencia / 1000 / 60 / 60;

      let result = false;
      //Si queda más de 1 hora para vencimiento de Token
      if (horas_al_vencimiento >= 1) {
        result = true;
      } else {
        //Verifica que token sea válido
        await this.chektoken()
          .then((r: boolean) => {
            result = r;
          })
          .catch(() => {
            //Desloguea si token no es válido
            this.logout(true);
            result = false;
          });
      }
      return result;
    } else {
      //Desloguea si token no es encontrado
      this.logout(false);
      return false;
    }
  }

  logout(mensaje: boolean) {
    localStorage.clear();
    if (mensaje) {
      this._toastProvider.infoMessage('Se ha cerrado la sesión.');
    }

    this._sideBarService.changeStatus(false, 'Invitado', '');
    this._routes.navigate(['/']);
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    var isLogued = await this.isLogued();

    let path = state.url;
    if (isLogued && path != undefined) {
      let split = path.split('/');
      //let result = split.length > 3 ? `${split[2]}/${split[3]}` : split[split.length - 1];

      isLogued = await this.canActivate_module(split[split.length - 1]);
      if(isLogued){
        let module = path[0] == '/' ? path.slice(1) : path;

        if(this.currentmodule != module){
          this._userMovement.NewUsersMovement('Ingresó a Módulo');
          this._sideBarService.changeModule(module);
        }
      }
    }
    return isLogued;
  }
}
