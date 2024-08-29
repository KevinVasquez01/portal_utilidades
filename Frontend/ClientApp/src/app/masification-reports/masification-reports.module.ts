import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MasificationReportsRoutes } from './masification-reports.routing';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from '../demo-material-module';
import { MatTableExporterModule } from 'mat-table-exporter';

import { ChartistModule } from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Documents
import { DocumentsIssuedMComponent } from './documents-issued-m/documents-issued-m.component';
import { DocumentsIssuedModule } from './documents-issued/documents-issued.module';

import { AlliesIncludesMTopComponent } from './allies-includes-m-top/allies-includes-m-top.component';
import { MasificationReportsDialogComponent } from './masification-reports-dialog/masification-reports-dialog.component';
import { CompaniesServiceStateComponent } from './companies-service-state/companies-service-state.component';
import { CompaniesServiceStateTableComponent } from './companies-service-state/companies-service-state-table/companies-service-state-table.component';
import { CompaniesServiceStateWidgetComponent } from './companies-service-state/companies-service-state-widget/companies-service-state-widget.component';
import { CompaniesServiceStateWidgetsComponent } from './companies-service-state/companies-service-state-widgets/companies-service-state-widgets.component';
import { CompaniesPlansPackagesComponent } from './companies-plans-packages/companies-plans-packages.component';
import { CompaniesPlansPackagesResultsComponent } from './companies-plans-packages/companies-plans-packages-results/companies-plans-packages-results.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(MasificationReportsRoutes),
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

    DocumentsIssuedModule,
  ],
  providers: [
    CurrencyPipe,
  ],
  entryComponents: [],
  declarations: [
    DocumentsIssuedMComponent,
    MasificationReportsDialogComponent,
    AlliesIncludesMTopComponent,
    CompaniesServiceStateComponent,
    CompaniesServiceStateTableComponent,
    CompaniesServiceStateWidgetComponent,
    CompaniesServiceStateWidgetsComponent,
    CompaniesPlansPackagesComponent,
    CompaniesPlansPackagesResultsComponent,
  ],
})
export class MasificationReportsModule { }
