import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
  profile?: string[];
  ambient?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
  profile?: string[];
  ambient?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  subchildren?: SubChildren[];
  profile?: string[];
  ambient?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
  profile?: string[];
  ambient?: string;
}

const MENUITEMS = [
  {
    state: 'starter',
    name: 'Inicio',
    type: 'link',
    icon: 'home',
  },
  /* {
    state: 'example1',
    name: 'Ejemplo1',
    type: 'link',
    icon: 'home',
  }, */
  {
    state: '',
    name: 'Empresa',
    type: 'saperator',
    icon: 'av_timer',
  },
  {
    state: 'create-company',
    name: 'Crear Empresa',
    type: 'link',
    icon: 'create',
  },
  {
    state: 'administration',
    name: 'Administración',
    type: 'sub',
    icon: 'business',
    profile: ['administrator', 'consultant'],
    children: [
      {
        state: 'admin-companies',
        name: 'Administrar empresas',
        type: 'link',
        profile: ['administrator', 'consultant'],
      },
      {
        state: 'admin-home-buttons',
        name: 'Botones de Inicio',
        type: 'link',
        profile: ['administrator'],
      },
      {
        state: 'admin-series',
        name: 'Crear series',
        type: 'link',
        profile: ['administrator', 'consultant'],
      },
      {
        state: 'admin-templates',
        name: 'Crear templates',
        type: 'link',
        profile: ['administrator', 'consultant'],
      },
      {
        state: 'enablement-FE',
        name: 'Habilitación FE',
        type: 'link',
        profile: ['administrator', 'consultant'],
      },
      {
        state: 'massiveplanspackages',
        name: 'Planes y/o Paquetes',
        type: 'link',
        profile: ['administrator'],
      },
      {
        state: 'massive-recovery-FE',
        name: 'Recuperación FE',
        type: 'link',
        profile: ['administrator', 'consultant'],
      },
      {
        state: 'massive-recovery-NE',
        name: 'Recuperación NE',
        type: 'link',
        profile: ['administrator', 'consultant'],
      },
      {
        state: 'sinco',
        name: 'SINCO',
        type: 'subchild',
        profile: ['administrator', 'consultant'],
        subchildren: [
          {
            state: 'customizable-fileds',
            name: 'Campos personalizables',
            profile: ['administrator', 'consultant'],
          },
          {
            state: 'history-changes',
            name: 'Histórico de Cambios',
            type: 'link',
            profile: ['administrator', 'consultant'],
          },
        ],
      },
    ],
  },
  {
    state: '',
    name: 'Informes',
    type: 'saperator',
    icon: 'av_timer',
    profile: ['administrator', 'commercial'],
  },
  {
    state: 'integration-reports',
    name: 'Integración',
    icon: 'assignment',
    type: 'sub',
    profile: ['administrator', 'commercial'],
    children: [
      {
        state: 'activations',
        name: 'Activaciones',
        type: 'subchild',
        profile: ['administrator', 'commercial'],
        subchildren: [
          {
            state: 'generate-fe',
            name: 'Generar Informe FE',
            type: 'link',
            ambient: 'PRD',
            profile: ['administrator'],
          },
          {
            state: 'generate-ds',
            name: 'Generar Informe DS',
            type: 'link',
            ambient: 'PRD',
            profile: ['administrator'],
          },
          {
            state: 'generate-ne',
            name: 'Generar Informe NE',
            type: 'link',
            ambient: 'PRD',
            profile: ['administrator'],
          },
          {
            state: 'generate-re',
            name: 'Generar Informe RE',
            type: 'link',
            ambient: 'PRD',
            profile: ['administrator'],
          },
          {
            state: 'generate-de',
            name: 'Generar Informe DE',
            type: 'link',
            ambient: 'PRD',
            profile: ['administrator'],
          },
          {
            state: 'history',
            name: 'Histórico Activaciones',
            type: 'link',
            profile: ['administrator', 'commercial'],
          },
          {
            state: 'allies-values',
            name: 'Precios Aliados',
            type: 'link',
            profile: ['administrator', 'commercial'],
          },
        ],
      },
      {
        state: 'documents',
        name: 'Documentos',
        type: 'subchild',
        profile: ['administrator', 'commercial'],
        subchildren: [
          {
            state: 'generate-documents-issued-i',
            name: 'Generar Informe',
            type: 'link',
            ambient: 'PRD',
            profile: ['administrator', 'commercial'],
          },
        ],
      },
    ],
  },
  {
    state: 'masification-reports',
    name: 'Masificación',
    icon: 'assessment',
    type: 'sub',
    profile: ['administrator', 'commercial'],
    children: [
      /* {
        state: 'activations',
        name: 'Activaciones',
        type: 'subchild',
        profile: ['administrator'],
        subchildren: [],
      }, */
      {
        state: 'documents',
        name: 'Documentos',
        type: 'subchild',
        profile: ['administrator', 'commercial'],
        subchildren: [
          {
            state: 'allies-inclues-top-documents-m',
            name: 'Aliados incluidos TOP',
            type: 'link',
            profile: ['administrator'],
          },
          {
            state: 'generate-documents-issued-m',
            name: 'Generar Informe',
            type: 'link',
            ambient: 'PRD',
            profile: ['administrator', 'commercial'],
          },
        ],
      },
      {
        state: 'companies-plans-packages',
        name: 'Planes y/o Paquetes',
        type: 'link',
        profile: ['administrator', 'commercial'],
      },
      {
        state: 'companies-service-state',
        name: 'Servicios Activos',
        ambient: 'PRD',
        type: 'link',
        profile: ['administrator', 'commercial'],
      },
    ],
  },
  {
    state: 'other-reports',
    name: 'Otros Informes',
    icon: 'assignment_late',
    type: 'sub',
    profile: ['administrator', 'commercial'],
    children: [
      {
        state: 'first-issuance-report',
        name: '1.ª Emisión/Recepción',
        type: 'link',
        ambient: 'PRD',
        profile: ['administrator', 'commercial'],
      },
      {
        state: 'filled-out-form-report',
        name: 'Empresas Formulario',
        type: 'link',
        profile: ['administrator', 'commercial'],
      },
      {
        state: 'audit-company-creations-report',
        name: 'Empresas autorizadas',
        type: 'link',
        profile: ['administrator'],
      },
      {
        state: 'audit-users-movements',
        name: 'Movimiento Usuarios',
        type: 'link',
        profile: ['administrator'],
      },
    ],
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
