import { Routes } from '@angular/router';

import { Example1Component } from './example1.component';

export const Ecample1Routes: Routes = [
    {
        path: '',
        component: Example1Component,
        data: {
            title: 'Página inicio',
            urls: [
                { title: 'Inicio' },
                { title: 'Página inicio' }
            ]
        }
    }
];
