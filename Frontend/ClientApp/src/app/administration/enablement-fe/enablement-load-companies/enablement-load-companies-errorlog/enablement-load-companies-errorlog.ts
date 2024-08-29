import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Enablement_Companies } from 'src/app/models/Enablement/Enablement';

@Component({
  selector: 'app-enablement-load-companies-errorlog',
  templateUrl: './enablement-load-companies-errorlog.html',
  styleUrls: ['./enablement-load-companies-errorlog.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EnablementLoadCompaniesErrorlogComponent {
  //Almacena log compañías
  @Input() companiesLogs: Enablement_Companies[] = [];
  ambiente = '';
  columnsToDisplay = ['Alias_Operador_Virtual', 'Nit', 'TestSetId'];
  @Output() exit: EventEmitter<boolean> = new EventEmitter();
  expandedElement: Enablement_Companies | null = null;

  constructor() {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }
  close() {
    this.exit.emit(false); //Cierra log
  }
}
