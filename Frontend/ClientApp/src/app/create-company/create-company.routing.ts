import { Routes } from '@angular/router';
import { CreateCompanyComponent } from './create-company.component';

export const CreateCompanyRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CreateCompanyComponent,
        data: {
          title: 'Crear empresa',
          urls: [
            { title: 'Inicio', url: '/starter' },
            { title: 'Crear empresa' },
          ],
        },
      },
    ],
  },
];
