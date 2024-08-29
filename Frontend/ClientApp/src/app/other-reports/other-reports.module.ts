import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OtherReportsRoutes } from './other-reports.routing';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from '../demo-material-module';
import { MatTableExporterModule } from 'mat-table-exporter';

import { ChartistModule } from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtherFirstIssuanceComponent } from './other-first-issuance/other-first-issuance.component';
import { OtherFirstIssuanceStateComponent } from './other-first-issuance/other-first-issuance-state/other-first-issuance-state.component';
import { OtherFirstIssuanceResultsComponent } from './other-first-issuance/other-first-issuance-results/other-first-issuance-results.component';
import { OtherFirstIssuanceWidgetsComponent } from './other-first-issuance/other-first-issuance-widgets/other-first-issuance-widgets.component';
import { CompaniesFilledoutFormComponent } from './companies-filledout-form/companies-filledout-form.component';
import { AuditCompanyCreationsComponent } from './audit-company-creations/audit-company-creations.component';
import { AuditCompanyCreationsTableComponent } from './audit-company-creations/audit-company-creations-table/audit-company-creations-table.component';
import { AuditCompanyCreationsWidgetsComponent } from './audit-company-creations/audit-company-creations-widgets/audit-company-creations-widgets.component';
import { UsersMovementsComponent } from './users-movements/users-movements.component';
import { UsersMovementsResultsComponent } from './users-movements/users-movements-results/users-movements-results.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(OtherReportsRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatTableExporterModule,
    ChartistModule,
    NgxChartsModule,
    NgApexchartsModule,
  ],
  providers: [
    CurrencyPipe,
  ],
  entryComponents: [],
  declarations: [
    OtherFirstIssuanceComponent,
    OtherFirstIssuanceStateComponent,
    OtherFirstIssuanceResultsComponent,
    OtherFirstIssuanceWidgetsComponent,
    CompaniesFilledoutFormComponent,
    AuditCompanyCreationsComponent,
    AuditCompanyCreationsTableComponent,
    AuditCompanyCreationsWidgetsComponent,
    UsersMovementsComponent,
    UsersMovementsResultsComponent
  ],
})
export class OtherReportsModule { }
