import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/services/UtilidadesAPI/notifications.service';
import { Notifications } from 'src/app/models/Notifications/notifications';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'app-vertical-header',
  templateUrl: './vertical-header.component.html',
  styleUrls: [],
})
export class VerticalAppHeaderComponent implements OnInit, AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};

  ambient = 'QA';
  logged = false;
  usuario_name = '';

  // This is for Notifications
  notifications: Notifications[] = [];

  public selectedLanguage: any = {
    language: 'Español',
    code: 'es',
    icon: 'es',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us',
    },
    {
      language: 'Español',
      code: 'es',
      icon: 'es',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr',
    },
  ];

  constructor(
    private translate: TranslateService,
    private _notifications: NotificationsService,
    private sideBarService: SideBarService,
  ) {
    translate.setDefaultLang('es');
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.sideBarService.customMessage.subscribe(
      (logged) => (this.logged = logged)
    );
    this.sideBarService.customusuario.subscribe(
      (user) => (this.usuario_name = user)
    );

    let ambiente = localStorage.getItem('ambient');
    this.ambient = ambiente != undefined ? ambiente : '';

    this._notifications.suscribeActuallyNotifications(300);
    this._notifications.actuallyNotification.subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }
}
