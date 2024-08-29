import { Component, Input, OnInit } from '@angular/core';
import { Report_Firts_Documents_action } from 'src/app/models/Reports/Documents/first-documents';

@Component({
  selector: 'app-other-first-issuance-state',
  templateUrl: './other-first-issuance-state.component.html',
  styleUrls: ['./other-first-issuance-state.component.scss']
})
export class OtherFirstIssuanceStateComponent implements OnInit {
  @Input() actually_action: Array<Report_Firts_Documents_action> = []; //Acción que se está ejecutando actualmente para vista
  @Input() total_OVs: number = 0; //Total de Operadores virtuales seleccionados

  constructor() {}

  ngOnInit(): void {}
}
