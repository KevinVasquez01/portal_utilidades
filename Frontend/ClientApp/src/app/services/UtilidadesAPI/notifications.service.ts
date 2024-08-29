import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthGuard } from 'src/app/auth.guard';
import { Notifications } from 'src/app/models/Notifications/notifications';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { UtilidadesAPIService } from './utilidades-api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private _UtilAPI: UtilidadesAPIService,
    private _Auth: AuthGuard,
    private _notificationService: PushNotificationService,
    private _toastProvider: ToastProvider
  ) {}

  //Notificaciones activas
  private actuallyNotifications = new BehaviorSubject<Array<Notifications>>([]);
  public actuallyNotification = this.actuallyNotifications.asObservable();

  Displayednotifications: Array<Notifications> = [];

  serviceIsActive: boolean = false;

  GetNotifications() {
    return new Promise((resolve, reject) => {
      this._UtilAPI.GetNotifications().subscribe(
        (data) => {
          let notifications: Notifications = JSON.parse(JSON.stringify(data));
          resolve(notifications);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  GetNotificationsByProfile(profile: string) {
    return new Promise((resolve, reject) => {
      this._UtilAPI.GetNotificationsByProfile(profile).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  NewNotifications(notifications: Array<Notifications>) {
    return new Promise((resolve, reject) => {
      this._UtilAPI.NewNotifications(notifications).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  DeleteNotificationsByCompanyDocument(companyDocument: string) {
    return new Promise((resolve, reject) => {
      this._UtilAPI
        .DeleteNotificationsByCompanyDocument(companyDocument)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  //Cambiar Notificaciones activas
  public changeActuallyNotifications(
    notifications: Array<Notifications>
  ): void {
    this.actuallyNotifications.next(notifications);
  }

  public async suscribeActuallyNotifications(seconds: number, force?: boolean) {
    let profile = localStorage.getItem('profile') || '';

    if (profile != '' && !this.serviceIsActive) {
      this._notificationService.requestPermission();
      this.serviceIsActive = true;
      let isLogued = await this._Auth.isLogued();
      if (isLogued) {
        let Milliseconds = seconds * 1000;
        await this.GetNotificationsByProfile('administrator')
          .then((result) => {
            let notifications: Array<Notifications> = JSON.parse(
              JSON.stringify(result)
            );
            this.changeActuallyNotifications(
              notifications.filter((x) => x.show)
            );

            this.notify(notifications.filter((x) => x.show));
          })
          .catch(() => {
            this.serviceIsActive = false;
          });

        if (force === undefined) {
          setTimeout(() => {
            if (this.serviceIsActive) {
              this.serviceIsActive = false;
              this.suscribeActuallyNotifications(seconds);
            }
          }, Milliseconds);
        } else {
          this.serviceIsActive = true;
        }
      }
    }
  }

  public suscribeActuallyNotificationsForce() {
    this.serviceIsActive = false;
    this.suscribeActuallyNotifications(0, true);
  }

  notify(notifications: Array<Notifications>) {
    let logindate = localStorage.getItem('logindate');
    if (logindate !== null) {
      let dateL = new Date(logindate);
      for (let i = 0; i < notifications.length; i++) {
        let dateN = new Date(notifications[i].date);
        let exist = this.Displayednotifications.find(
          (x) => x.id === notifications[i].id
        );

        if (dateN.valueOf() >= dateL.valueOf() && (exist === undefined)) {
          try {
            let data = [
              {
                title: `${notifications[i].notification}`,
                alertContent: `${notifications[i].text1} - ${notifications[i].text2}`,
              },
            ];
            this._notificationService.generateNotification(data);
            this._toastProvider.infoMessage(
              `${notifications[i].notification} ${notifications[i].text1}`
            );
            this.Displayednotifications.push(notifications[i]);
            break;
          } catch {
            console.error;
          }
        }
      }
    }
  }
}

export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}

@Injectable()
export class PushNotificationService {
  public permission: Permission;
  constructor() {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }
  public isSupported(): boolean {
    return 'Notification' in window;
  }
  requestPermission(): void {
    let self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function (status) {
        return (self.permission = status);
      });
    }
  }
  create(title: string, options?: PushNotification): any {
    let self = this;
    return new Observable(function (obs) {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log(
          "The user hasn't granted you permission to send push notifications"
        );
        obs.complete();
      }
      let _notify = new Notification(title, options);
      _notify.onshow = function (e) {
        return obs.next({
          notification: _notify,
          event: e,
        });
      };
      _notify.onclick = function (e) {
        return obs.next({
          notification: _notify,
          event: e,
        });
      };
      _notify.onerror = function (e) {
        return obs.error({
          notification: _notify,
          event: e,
        });
      };
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }
  generateNotification(source: Array<any>): void {
    let self = this;
    source.forEach((item) => {
      let options = {
        body: item.alertContent,
        icon: 'assets/images/notificationIcon.jpeg',
      };
      let notify = self.create(item.title, options).subscribe();
    });
  }
}
