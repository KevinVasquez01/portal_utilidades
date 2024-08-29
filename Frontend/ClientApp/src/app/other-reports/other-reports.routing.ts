import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AuditCompanyCreationsComponent } from './audit-company-creations/audit-company-creations.component';
import { CompaniesFilledoutFormComponent } from './companies-filledout-form/companies-filledout-form.component';

import { OtherFirstIssuanceComponent } from './other-first-issuance/other-first-issuance.component';
import { UsersMovementsComponent } from './users-movements/users-movements.component';
export const OtherReportsRoutes: Routes = [
  {
    path: 'first-issuance-report',
    canActivate: [AuthGuard],
    component: OtherFirstIssuanceComponent,
    data: {
      title: 'Informe de Primera Emisión y Recepción de Documentos',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Otros Informes' },
        { title: 'Primera Emisión' },
      ],
    },
  },
  {
    path: 'filled-out-form-report',
    canActivate: [AuthGuard],
    component: CompaniesFilledoutFormComponent,
    data: {
      title: 'Informe de Empresas que Diligenciaron formulario',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Otros Informes' },
        { title: 'Diligenciamiento formulario' },
      ],
    },
  },
  {
    path: 'audit-company-creations-report',
    canActivate: [AuthGuard],
    component: AuditCompanyCreationsComponent,
    data: {
      title: 'Informe de Empresas autorizadas o Eliminadas',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Otros Informes' },
        { title: 'Auditoría de Empresas' },
      ],
    },
  },
  {
    path: 'audit-users-movements',
    canActivate: [AuthGuard],
    component: UsersMovementsComponent,
    data: {
      title: 'Informe de Movimiento de Usuarios',
      urls: [
        { title: 'Inicio', url: '/starter' },
        { title: 'Otros Informes' },
        { title: 'Movimiento de Usuarios' },
      ],
    },
  },
];
