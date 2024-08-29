import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AdminCompaniesComponent } from './admin-companies/admin-companies.component';
import { AdminHomeButtonsComponent } from './admin-home-buttons/admin-home-buttons.component';
import { AdminSeriesComponent } from './admin-series/admin-series.component';
import { AdminTemplatesComponent } from './admin-templates/admin-templates.component';
import { CustomizableFieldsSincoComponent } from './sinco/customizable-fields-sinco/customizable-fields-sinco.component';
import { EnablementFEComponent } from './enablement-fe/enablement-fe.component';
import { MassiveRecoveryFEComponent } from './massive-recovery-fe/massive-recovery-fe.component';
import { MassiveRecoveryNEComponent } from './massive-recovery-ne/massive-recovery-ne.component';
import { HistoryChangesSincoComponent } from './sinco/history-changes-sinco/history-changes-sinco.component';
import { MassiveplanspackagesComponent } from './massive-plans-packages/massive-plans-packages.component';
export const AdministrationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'admin-companies',
        canActivate: [AuthGuard],
        component: AdminCompaniesComponent,
        data: {
          title: 'Administrar empresas',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Administrar empresas' },
          ],
        },
      },
      {
        path: 'admin-templates',
        canActivate: [AuthGuard],
        component: AdminTemplatesComponent,
        data: {
          title: 'Crear templates',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Crear templates' },
          ],
        },
      },
      {
        path: 'admin-series',
        canActivate: [AuthGuard],
        component: AdminSeriesComponent,
        data: {
          title: 'Crear Series',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Crear Series' },
          ],
        },
      },
      {
        path: 'enablement-FE',
        canActivate: [AuthGuard],
        component: EnablementFEComponent,
        data: {
          title: 'Habilitación Facturación Electrónica',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Habilitación FE' },
          ],
        },
      },
      {
        path: 'massive-recovery-FE',
        canActivate: [AuthGuard],
        component: MassiveRecoveryFEComponent,
        data: {
          title: 'Recuperación Masiva de Facturación Electrónica',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Recuperación Masiva FE' },
          ],
        },
      },
      {
        path: 'massive-recovery-NE',
        canActivate: [AuthGuard],
        component: MassiveRecoveryNEComponent,
        data: {
          title: 'Recuperación Masiva de Nómina Electrónica',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Recuperación Masiva NE' },
          ],
        },
      },
      {
        path: 'admin-home-buttons',
        canActivate: [AuthGuard],
        component: AdminHomeButtonsComponent,
        data: {
          title: 'Administración Botones página de Inicio',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Botones página de Inicio' },
          ],
        },
      },
      {
        path: 'sinco/customizable-fileds',
        canActivate: [AuthGuard],
        component: CustomizableFieldsSincoComponent,
        data: {
          title: 'Configuración de Campos Personalizables Sinco',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Sinco' },
            { title: 'Campos Personalizables' },
          ],
        },
      },
      {
        path: 'sinco/history-changes',
        canActivate: [AuthGuard],
        component: HistoryChangesSincoComponent,
        data: {
          title: 'Histórico de Cambios Macroplantilla',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Sinco' },
            { title: 'Histórico de Cambios' },
          ],
        },
      },
      {
        path: 'massiveplanspackages',
        canActivate: [AuthGuard],
        component: MassiveplanspackagesComponent,
        data: {
          title: 'Planes y/o Paquetes Masivos',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Administración' },
            { title: 'Planes y/o Paquetes' },
          ],
        },
      },
    ],
  },
];
