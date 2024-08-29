import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdministrationRoutes } from './administration.routing';

/* Admin Companies */
import { AdminCompaniesComponent } from './admin-companies/admin-companies.component';
import { CompaniesPendingComponent } from './admin-companies/companies-pending/companies-pending.component';
import { CompaniesSentComponent } from './admin-companies/companies-sent/companies-sent.component';
import { CompaniesSentLog1Component } from './admin-companies/companies-sent/companies-sent-log1/companies-sent-log1.component';
import { CompaniesToAuthorizeComponent } from './admin-companies/companies-to-authorize/companies-to-authorize.component';
import { CompaniesToAuthorizePackagesComponent } from './admin-companies/companies-to-authorize/companies-to-authorize-packages/companies-to-authorize-packages.component';
import { SentLogsComponent } from './admin-companies/companies-sent/sent-logs/sent-logs.component';
/* Admin Series */
import { AdminSeriesComponent } from './admin-series/admin-series.component';
import { AdminSeriesCreateComponent } from './admin-series/admin-series-create/admin-series-create.component';
import { AdminSeriesLogComponent } from './admin-series/admin-series-log/admin-series-log.component';
/* Admin Templates */
import { AdminTemplatesComponent } from './admin-templates/admin-templates.component';
import { TemplatesCreateComponent } from './admin-templates/templates-create/templates-create.component';
import { TemplatesLogComponent } from './admin-templates/templates-log/templates-log.component';

import { EditCompanyComponent } from './edit-company/edit-company.component';
import { SearchCompanyComponent } from './search-company/search-company.component';
import { CompanyDialogComponent } from './company-dialog/company-dialog.component';

/* Create Company */
import { CreateCompanyModule } from '../create-company/create-company.module';

/* Habilitacion FE */
import { EnablementFEComponent } from './enablement-fe/enablement-fe.component';
import { EnablementLoadCompaniesComponent } from './enablement-fe/enablement-load-companies/enablement-load-companies.component';
import { ExportService } from './export.service';
import { EnablementCompaniesFeComponent } from './enablement-fe/enablement-companies-fe/enablement-companies-fe.component';
import { EnablementLoadCompaniesErrorlogComponent } from './enablement-fe/enablement-load-companies/enablement-load-companies-errorlog/enablement-load-companies-errorlog';
import { EnablementLogComponent } from './enablement-fe/enablement-log/enablement-log.component';
import { EnablementLogDetailsComponent } from './enablement-fe/enablement-log/enablement-log-details/enablement-log-details.component';

/* Traductor */
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

/* Botones de Inicio */
import { AdminHomeButtonsComponent } from './admin-home-buttons/admin-home-buttons.component';
import { AdminHomeButtonsDialogComponent } from './admin-home-buttons/admin-home-buttons-dialog/admin-home-buttons-dialog.component';
import { AdminHomeButtonsDeleteComponent } from './admin-home-buttons/admin-home-buttons-delete/admin-home-buttons-delete.component';
import { AdminHomeButtonsOkComponent } from './admin-home-buttons/admin-home-buttons-ok/admin-home-buttons-ok.component';

/* SINCO */
import { CustomizableFieldsSincoComponent } from './sinco/customizable-fields-sinco/customizable-fields-sinco.component';
import { CustomizableFieldsSincoDialogComponent } from './sinco/customizable-fields-sinco/customizable-fields-sinco-dialog/customizable-fields-sinco-dialog.component';
import { CustomizableFieldsSincoTableComponent } from './sinco/customizable-fields-sinco/customizable-fields-sinco-table/customizable-fields-sinco-table.component';

/* Recuperacion FE */
import { MassiveRecoveryFEComponent } from './massive-recovery-fe/massive-recovery-fe.component';
import { MassiveRecoveryRunFeComponent } from './massive-recovery-fe/massive-recovery-run-fe/massive-recovery-run-fe.component';
import { MassiveRecoveryResultsFeComponent } from './massive-recovery-fe/massive-recovery-results-fe/massive-recovery-results-fe.component';
import { MassiveRecoveryLogsFeComponent } from './massive-recovery-fe/massive-recovery-logs-fe/massive-recovery-logs-fe.component';

/* Recuperacion NE */
import { MassiveRecoveryResultsNeComponent } from './massive-recovery-ne/massive-recovery-results-ne/massive-recovery-results-ne.component';
import { MassiveRecoveryRunNEComponent } from './massive-recovery-ne/massive-recovery-run-ne/massive-recovery-run-ne.component';
import { MassiveRecoveryLogsNeComponent } from './massive-recovery-ne/massive-recovery-logs-ne/massive-recovery-logs-ne.component';
import { MassiveRecoveryNEComponent } from './massive-recovery-ne/massive-recovery-ne.component';
import { HistoryChangesSincoComponent } from './sinco/history-changes-sinco/history-changes-sinco.component';
import { HistoryChangesSincoTopchangesComponent } from './sinco/history-changes-sinco/history-changes-sinco-topchanges/history-changes-sinco-topchanges.component';
import { HistoryChangesSincoCurrentcompanyComponent } from './sinco/history-changes-sinco/history-changes-sinco-currentcompany/history-changes-sinco-currentcompany.component';
import { HistoryChangesSincoNewChangeComponent } from './sinco/history-changes-sinco/history-changes-sinco-new-change/history-changes-sinco-new-change.component';

/* MassivePlansPackages */
import { MassiveplanspackagesComponent } from './massive-plans-packages/massive-plans-packages.component';
import { MassivePlansPackagesLoadCompaniesComponent } from './massive-plans-packages/massive-plans-packages-load-companies/massive-plans-packages-load-companies.component';
import { MassivePlansPackagesSelectComponent } from './massive-plans-packages/massive-plans-packages-select/massive-plans-packages-select.component';
import { MassivePlansPackagesResultsComponent } from './massive-plans-packages/massive-plans-packages-results/massive-plans-packages-results.component';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdministrationRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    CreateCompanyModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [ExportService],
  entryComponents: [],
  declarations: [
    /* Admin Companies */
    AdminCompaniesComponent,
    CompaniesPendingComponent,
    CompaniesSentComponent,
    CompaniesSentLog1Component,
    SentLogsComponent,
    CompaniesToAuthorizeComponent,
    CompaniesToAuthorizePackagesComponent,
    /* Admin Series */
    AdminSeriesComponent,
    AdminSeriesCreateComponent,
    AdminSeriesLogComponent,
    /* Admin Templates */
    AdminTemplatesComponent,
    TemplatesCreateComponent,
    TemplatesLogComponent,

    CompanyDialogComponent,
    EditCompanyComponent,
    SearchCompanyComponent,

    /* Habilitacion FE */
    EnablementFEComponent,
    EnablementLoadCompaniesComponent,
    EnablementLoadCompaniesErrorlogComponent,
    EnablementCompaniesFeComponent,
    EnablementLogComponent,
    EnablementLogDetailsComponent,
    MassiveRecoveryNEComponent,
    MassiveRecoveryResultsNeComponent,
    MassiveRecoveryRunNEComponent,
    MassiveRecoveryLogsNeComponent,
    AdminHomeButtonsComponent,
    AdminHomeButtonsDialogComponent,
    AdminHomeButtonsDeleteComponent,
    AdminHomeButtonsOkComponent,
    CustomizableFieldsSincoComponent,
    CustomizableFieldsSincoDialogComponent,
    CustomizableFieldsSincoTableComponent,
    MassiveRecoveryFEComponent,
    MassiveRecoveryRunFeComponent,
    MassiveRecoveryResultsFeComponent,
    MassiveRecoveryLogsFeComponent,
    HistoryChangesSincoComponent,
    HistoryChangesSincoTopchangesComponent,
    HistoryChangesSincoCurrentcompanyComponent,
    HistoryChangesSincoNewChangeComponent,

    /* MassivePlansPackages */
    MassiveplanspackagesComponent,
    MassivePlansPackagesLoadCompaniesComponent,
    MassivePlansPackagesSelectComponent,
    MassivePlansPackagesResultsComponent,
  ],
})
export class AdministrationModule {}
