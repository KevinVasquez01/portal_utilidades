import { Routes } from '@angular/router';

import { StarterComponent } from './starter.component';

export const StarterRoutes: Routes = [
    {
        path: '',
        component: StarterComponent,
        data: {
            title: 'Página inicio',
            urls: [
                { title: 'Inicio' },
                { title: 'Página inicio' }
            ]
        }
    }
];
