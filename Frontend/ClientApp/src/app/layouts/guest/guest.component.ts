import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
	ChangeDetectorRef,
	Component,
	OnDestroy
} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';


import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { SideBarService } from 'src/app/services/side-bar.service';
import { AuthGuard } from 'src/app/auth.guard';
/** @title Responsive sidenav */
@Component({
	selector: 'app-guest-layout',
	templateUrl: 'guest.component.html',
	styleUrls: []
})
export class GuestComponent implements OnDestroy {
	mobileQuery: MediaQueryList;

	dir = 'ltr';
	dark = false;
	minisidebar = true;
	boxed = false;
	horizontal = false;

	green = false;
	blue = true;
	danger = false;
	showHide = false;
	url = '';
	sidebarOpened = false;
	status = false;

	public showSearch = false;
	public config: PerfectScrollbarConfigInterface = {};
	// tslint:disable-next-line - Disables all
	private _mobileQueryListener: () => void;

	constructor(
    private sideBarService: SideBarService,
    private _authGuard: AuthGuard,
		public router: Router,
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher,
		public menuItems: MenuItems
	) {
		this.mobileQuery = media.matchMedia('(min-width: 1100px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		// tslint:disable-next-line: deprecation
		this.mobileQuery.addListener(this._mobileQueryListener);
		// this is for dark theme
		// const body = document.getElementsByTagName('body')[0];
		// body.classList.toggle('dark');
		this.dark = false;
	}

	ngOnDestroy(): void {
		// tslint:disable-next-line: deprecation
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}


	async ngOnInit() {
    let logged = await this._authGuard.isLogued();
    let userfullname = localStorage.getItem('userfullname');
    let profile = localStorage.getItem('profile');

    this.sideBarService.changeStatus(
      logged,
      logged ? (userfullname != undefined ? userfullname : 'Invitado') : 'Invitado',
      logged ? (profile != undefined ? profile : 'User') : ''
    );
	}

	clickEvent(): void {
		 this.status = !this.status;
	}

	darkClick() {
		// const body = document.getElementsByTagName('body')[0];
		// this.dark = this.dark;
		const body = document.getElementsByTagName('body')[0];
		body.classList.toggle('dark');
		// if (this.dark)
		// else
		// 	body.classList.remove('dark');
		// this.dark = this.dark;
		// body.classList.toggle('dark');
		// this.dark = this.dark;
	}



}
