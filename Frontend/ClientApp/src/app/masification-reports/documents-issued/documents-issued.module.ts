import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from '../../demo-material-module';
import { MatTableExporterModule } from 'mat-table-exporter';

import { ChartistModule } from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsIssuedResultComponent } from './documents-issued-result/documents-issued-result.component';
import { DocumentsIsuedWidgetsComponent } from './documents-isued-widgets/documents-isued-widgets.component';
import { DocumentsIssuedComponent } from './documents-issued.component';
import { DocumentsIssuedStateComponent } from './documents-issued-state/documents-issued-state.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
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
    DocumentsIssuedResultComponent,
    DocumentsIsuedWidgetsComponent,
    DocumentsIssuedComponent,
    DocumentsIssuedStateComponent,
  ],
  exports: [
    DocumentsIssuedResultComponent,
    DocumentsIsuedWidgetsComponent,
    DocumentsIssuedComponent,
  ]
})
export class DocumentsIssuedModule { }
