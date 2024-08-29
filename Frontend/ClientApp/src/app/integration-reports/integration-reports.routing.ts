import { Routes } from '@angular/router';

// Activaciones
import { ActivacionesFEComponent } from './integration-reports-activaciones/activaciones-fe/activaciones-fe.component';
import { ActivacionesNEComponent } from './integration-reports-activaciones/activaciones-ne/activaciones-ne.component';
import { AlliesValuesComponent } from './integration-reports-activaciones/allies-values/allies-values.component';
import { ActivacionesHistoryComponent } from './integration-reports-activaciones/activaciones-history/activaciones-history.component';
import { AuthGuard } from '../auth.guard';
import { ActivacionesDSComponent } from './integration-reports-activaciones/activaciones-ds/activaciones-ds.component';
import { DocumentsIssuedIComponent } from './documents-issued-i/documents-issued-i.component';
import { ActivacionesReComponent } from './integration-reports-activaciones/activaciones-re/activaciones-re.component';
import { ActivacionesDEComponent } from './integration-reports-activaciones/activaciones-de/activaciones-de.component';
export const IntegrationReportsRoutes: Routes = [
  {
    path: 'activations/allies-values',
    canActivate: [AuthGuard],
    component: AlliesValuesComponent,
    data: {
      title: 'Precios Aliados',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Activaciones' },
        { title: 'Precios Aliados' },
      ],
    },
  },
  {
    path: 'activations/generate-fe',
    canActivate: [AuthGuard],
    component: ActivacionesFEComponent,
    data: {
      title: 'Generar Informe Activaciones Facturación Electrónica',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Activaciones' },
        { title: 'Generar FE' },
      ],
    },
  },
  {
    path: 'activations/generate-ds',
    canActivate: [AuthGuard],
    component: ActivacionesDSComponent,
    data: {
      title: 'Generar Informe Activaciones Documento Soporte',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Activaciones' },
        { title: 'Generar DS' },
      ],
    },
  },
  {
    path: 'activations/generate-ne',
    canActivate: [AuthGuard],
    component: ActivacionesNEComponent,
    data: {
      title: 'Generar Informe Activaciones Nómina Electrónica',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Activaciones' },
        { title: 'Generar NE' },
      ],
    },
  },
  {
    path: 'activations/generate-re',
    canActivate: [AuthGuard],
    component: ActivacionesReComponent,
    data: {
      title: 'Generar Informe Activaciones Recepción Electrónica',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Activaciones' },
        { title: 'Generar RE' },
      ],
    },
  },
  {
    path: 'activations/generate-de',
    canActivate: [AuthGuard],
    component: ActivacionesDEComponent,
    data: {
      title: 'Generar Informe Activaciones  Documento Equivalente Electrónico',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Activaciones' },
        { title: 'Generar DE' },
      ],
    },
  },
  {
    path: 'activations/history',
    canActivate: [AuthGuard],
    component: ActivacionesHistoryComponent,
    data: {
      title: 'Historial de informe Activaciones',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Activaciones' },
        { title: 'Historial Activaciones' },
      ],
    },
  },
  {
    path: 'documents/generate-documents-issued-i',
    canActivate: [AuthGuard],
    component: DocumentsIssuedIComponent,
    data: {
      title: 'Informe de Documentos Emitidos y Recibidos Integración',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Integración' },
        { title: 'Documentos' },
        { title: 'Emitidos y Recibidos' },
      ],
    },
  },
];
