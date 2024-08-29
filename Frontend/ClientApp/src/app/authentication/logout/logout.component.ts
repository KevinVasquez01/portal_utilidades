import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { SideBarService } from 'src/app/services/side-bar.service';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: [],
})
export class LogoutComponent implements OnInit {
  constructor(
    private _router: Router,
    private _toastProvider: ToastProvider,
    private _sideBarService: SideBarService,
    private _userMovement: UserMovementsService
  ) {}

  ngOnInit(): void {
    //Notifica movimiento Cierre de sesión
    this._userMovement.NewUsersMovement('Cierre de sesión', 'authentication/logout');

    localStorage.clear();
    this._toastProvider.infoMessage('Se ha cerrado la sesión.');
    this._sideBarService.changeStatus(false, 'Invitado', '');
    this._router.navigate(['/authentication/login']);
  }
}
