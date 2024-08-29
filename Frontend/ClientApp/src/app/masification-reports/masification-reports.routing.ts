import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AlliesIncludesMTopComponent } from './allies-includes-m-top/allies-includes-m-top.component';
import { CompaniesPlansPackagesComponent } from './companies-plans-packages/companies-plans-packages.component';
import { CompaniesServiceStateComponent } from './companies-service-state/companies-service-state.component';
import { DocumentsIssuedMComponent } from './documents-issued-m/documents-issued-m.component';
export const MasificationReportsRoutes: Routes = [
  {
    path: 'documents/generate-documents-issued-m',
    canActivate: [AuthGuard],
    component: DocumentsIssuedMComponent,
    data: {
      title: 'Informe de Documentos Emitidos y Recibidos Masificación',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Masificación' },
        { title: 'Documentos' },
        { title: 'Emitidos y Recibidos' },
      ],
    },
  },
  {
    path: 'documents/allies-inclues-top-documents-m',
    canActivate: [AuthGuard],
    component: AlliesIncludesMTopComponent,
    data: {
      title: 'Aliados incluidos en Top - Documentos Masificación',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Masificación' },
        { title: 'Documentos' },
        { title: 'Aliados en Top' },
      ],
    },
  },
  {
    path: 'companies-service-state',
    canActivate: [AuthGuard],
    component: CompaniesServiceStateComponent,
    data: {
      title: 'Informe de Servicios Activos por Empresa',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Masificación' },
        { title: 'Servicios Activos' },
      ],
    },
  },
  {
    path: 'companies-plans-packages',
    canActivate: [AuthGuard],
    component: CompaniesPlansPackagesComponent,
    data: {
      title: 'Informe de Planes y/o Paquetes Asignados por Empresa',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Masificación' },
        { title: 'Planes y/o Paquetes' },
      ],
    },
  },
];
