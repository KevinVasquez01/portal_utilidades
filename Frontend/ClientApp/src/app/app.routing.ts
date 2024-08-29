import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AppBlankComponent } from './layouts/blank/blank.component';

import { FullComponent } from './layouts/full/full.component';
import { GuestComponent } from './layouts/guest/guest.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./starter/starter.module').then((m) => m.StarterModule),
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./starter/starter.module').then((m) => m.StarterModule),
      },
      {
        path: 'create-company',
        loadChildren: () =>
          import('./create-company/create-company.module').then((m) => m.CreateCompanyModule),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'administration',
        loadChildren: () =>
          import('./administration/administration.module').then(
            (m) => m.AdministrationModule
          ),
      },
      {
        path: 'integration-reports',
        loadChildren: () =>
          import('./integration-reports/integration-reports.module').then(
            (m) => m.IntegrationsReportsModule
          ),
      },
      {
        path: 'masification-reports',
        loadChildren: () =>
          import('./masification-reports/masification-reports.module').then(
            (m) => m.MasificationReportsModule
          ),
      },
      {
        path: 'other-reports',
        loadChildren: () =>
          import('./other-reports/other-reports.module').then(
            (m) => m.OtherReportsModule
          ),
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./starter/starter.module').then((m) => m.StarterModule),
      },
      {
        path: 'example1',
        loadChildren: () =>
          import('./example1/example1.module').then(
            (m) => m.Example1Module
          ),
      },
    ],
  },
  {
    path: '',
    component: AppBlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/404',
  },
];
