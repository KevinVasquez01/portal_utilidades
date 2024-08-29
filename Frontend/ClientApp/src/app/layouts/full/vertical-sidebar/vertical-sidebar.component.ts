import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';

import { MenuItems } from '../../../shared/menu-items/menu-items';
import { SideBarService } from 'src/app/services/side-bar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: [],
})
export class VerticalAppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;

  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _mobileQueryListener: () => void;
  status = true;
  showMenu = '';

  itemSelect: number[] = [];
  parentIndex = 0;
  childIndex = 0;

  usuario_name = '';
  perfil = '';
  logged = false;

  ngOnInit() {
    this.sideBarService.customMessage.subscribe(
      (logged) => (this.logged = logged)
    );
    this.sideBarService.customusuario.subscribe(
      (user) => (this.usuario_name = user)
    );
    this.sideBarService.customperfil.subscribe(
      (profile) => (this.perfil = profile)
    );
  }

  loggout() {
    localStorage.clear();
    this.sideBarService.changeStatus(true, 'Invitado', 'Usuario');
    this._router.navigate(['/authentication/login']);
  }

  setClickedRow(i: number, j: number) {
    this.parentIndex = i;
    this.childIndex = j;
  }
  subclickEvent() {
    this.status = true;
  }
  scrollToTop() {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  validateProfile(profile: string[] | undefined, ambient: string | undefined) {
    return this._AGuard.validateProfile(profile, ambient);
  }

  constructor(
    private _AGuard: AuthGuard,
    private _router: Router,
    private sideBarService: SideBarService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  handleNotify() {
    if (window.innerWidth < 1024) {
      this.notify.emit(!this.showClass);
    }
  }

}
