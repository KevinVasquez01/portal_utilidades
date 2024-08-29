import { Component, OnInit } from '@angular/core';
import { homeDataElements } from '../models/HomeDataElements/home-data-elements';
import { DataElementsService } from '../services/UtilidadesAPI/data-elements.service';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
})
export class StarterComponent implements OnInit {
  constructor(private _dataElementsU: DataElementsService) {}

  ngOnInit(): void {
    this.getDataElements();
  }

  homeDataElements: homeDataElements[] = [];
    // {
    //   id: 1,
    //   faIcon: 'fa-lightbulb-o',
    //   tittle: 'Centro de conocimiento',
    //   text: 'Manuales y videotutoriales uso plataforma saphety.',
    //   url: 'https://saphetylevel.sharepoint.com/:f:/s/SaphetyColombiaPublico/EuikvQCwCc1Gi5P5_TRb6RgBXCLR_2zYpYysSmrzyT8dxw?e=baVQms',
    // },
    // {
    //   id: 2,
    //   faIcon: 'fa-laptop',
    //   tittle: 'SaphetyDoc',
    //   text: 'Plataforma SaphetyDoc.',
    //   url: 'https://factura-electronica-co.saphety.com/saphety/login',
    // },
    // {
    //   id: 3,
    //   faIcon: 'fa-question-circle',
    //   tittle: 'HelpDesk',
    //   text: 'Plataforma de Soporte.',
    //   url: 'https://procesosyprocesos.freshdesk.com/support/home',
    // },
    // {
    //   id: 4,
    //   faIcon: 'fa-calendar',
    //   tittle: 'Capacitación Facturación Electrónica',
    //   text: 'Todos los martes a partir de las 2pm.',
    //   url: 'https://procesosyprocesos.freshdesk.com/a/solutions/articles/48001216687',
    // },
    // {
    //   id: 5,
    //   faIcon: 'fa-calendar',
    //   tittle: 'Capacitación Nómina Electrónica',
    //   text: 'Todos los Jueves a partir de las 2pm.',
    //   url: 'https://procesosyprocesos.freshdesk.com/a/solutions/articles/48001216688',
    // },
    // {
    //   id: 6,
    //   faIcon: 'fa-calendar',
    //   tittle: 'Webinar proceso Recepción',
    //   text: 'Todos los Jueves de 11am a 11:30am.',
    //   url: 'https://procesosyprocesos.freshdesk.com/a/solutions/articles/48001216690',
    // },


  goToLink(url: string | undefined) {
    if (url !== undefined) {
      window.open(url, '_blank');
    }
  }

  async getDataElements() {
    await this._dataElementsU
      .getHomeDataElements()
      .then((data) => {
        this.homeDataElements = JSON.parse(data['json']);
      })
      .catch(() => {
        console.log('Error al obtener Botones de Inicio');
      });
  }
}
