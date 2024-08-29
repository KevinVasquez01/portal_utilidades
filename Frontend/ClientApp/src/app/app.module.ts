import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';

import { VerticalAppHeaderComponent } from './layouts/full/vertical-header/vertical-header.component';
import { VerticalAppSidebarComponent } from './layouts/full/vertical-sidebar/vertical-sidebar.component';

import { AppBreadcrumbComponent } from './layouts/full/breadcrumb/breadcrumb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { SideBarService } from './services/side-bar.service';
import { AuthorizeCompanyService } from './services/UtilidadesAPI/authorize-company.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './custom-mat-paginator-int';
import { AuthGuard } from './auth.guard';
import { GuestComponent } from './layouts/guest/guest.component';
import { GuestAppHeaderComponent } from './layouts/guest/guest-header/guest-header.component';
import { GuestAppSidebarComponent } from './layouts/guest/guest-sidebar/guest-sidebar.component';

import { ExportService } from './services/export.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PushNotificationService } from './services/UtilidadesAPI/notifications.service';

import { SanitizeHtmlPipe } from './notifications/pipes/sanitizeHtml.pipe';
import { ToastComponent } from './notifications/toast/toast.component';
import { ToastProvider } from './notifications/toast/toast.provider';
import { SVGProvider } from './notifications/providers/svg.provider';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    VerticalAppHeaderComponent,
    VerticalAppSidebarComponent,
    AppBreadcrumbComponent,

    GuestComponent,
    GuestAppHeaderComponent,
    GuestAppSidebarComponent,

    SpinnerComponent,
    AppBlankComponent,

    SanitizeHtmlPipe,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgbModule,
  ],
  providers: [
    SVGProvider,
    ToastProvider,
    PushNotificationService,
    AuthGuard,
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
    DatePipe,
    SideBarService,
    AuthorizeCompanyService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    ExportService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
