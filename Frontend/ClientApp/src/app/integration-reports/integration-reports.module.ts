import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IntegrationReportsRoutes } from './integration-reports.routing';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from '../demo-material-module';
import { MatTableExporterModule } from 'mat-table-exporter';

import { ChartistModule } from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Activaciones
import { CurrencyInputDirective } from '../currency-input.directive';
import { ActivacionesFEComponent } from './integration-reports-activaciones/activaciones-fe/activaciones-fe.component';
import { ActivacionesNEComponent } from './integration-reports-activaciones/activaciones-ne/activaciones-ne.component';
import { ActivacionesDEComponent } from './integration-reports-activaciones/activaciones-de/activaciones-de.component';
import { ActivacionesTableComponent } from './integration-reports-activaciones/activaciones-table/activaciones-table.component';
import { ActivacionesWidgetsComponent } from './integration-reports-activaciones/activaciones-widgets/activaciones-widgets.component';
import { AlliesValuesComponent } from './integration-reports-activaciones/allies-values/allies-values.component';
import { AlliesValuesDialogComponent } from './integration-reports-activaciones/allies-values/allies-values-dialog/allies-values-dialog.component';
import { IntegrationReportsDialogComponent } from './integration-reports-dialog/integration-reports-dialog.component';

import { HistoryActivationsStatisticsComponent } from './integration-reports-activaciones/activaciones-history/history-activations-statistics/history-activations-statistics.component';
import { ActivacionesHistoryComponent } from './integration-reports-activaciones/activaciones-history/activaciones-history.component';
import { ActivacionesDSComponent } from './integration-reports-activaciones/activaciones-ds/activaciones-ds.component';

//Documentos
import { DocumentsIssuedIComponent } from './documents-issued-i/documents-issued-i.component';

//Documentos Emitidos y Recibidos Module
import { DocumentsIssuedModule } from '../masification-reports/documents-issued/documents-issued.module';
import { ActivacionesReComponent } from './integration-reports-activaciones/activaciones-re/activaciones-re.component';
import { HistoryActivationsStatistics1Component } from './integration-reports-activaciones/activaciones-history/history-activations-statistics1/history-activations-statistics1.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(IntegrationReportsRoutes),
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
    //Activaciones
    AlliesValuesComponent,
    AlliesValuesDialogComponent,
    ActivacionesNEComponent,
    CurrencyInputDirective,
    ActivacionesTableComponent,
    ActivacionesWidgetsComponent,

    IntegrationReportsDialogComponent,
    ActivacionesHistoryComponent,
    ActivacionesFEComponent,
    ActivacionesDEComponent,
    HistoryActivationsStatisticsComponent,
    ActivacionesDSComponent,
    DocumentsIssuedIComponent,
    ActivacionesReComponent,
    HistoryActivationsStatistics1Component,
  ],
})
export class IntegrationsReportsModule {}
