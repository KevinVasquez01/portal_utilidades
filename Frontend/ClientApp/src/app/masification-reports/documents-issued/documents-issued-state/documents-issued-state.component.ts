import { Component, Input, OnInit } from '@angular/core';
import { Report_Documents_ActuallyAction } from 'src/app/models/Reports/Documents/documents-issued';

@Component({
  selector: 'app-documents-issued-state',
  templateUrl: './documents-issued-state.component.html',
  styleUrls: ['./documents-issued-state.component.scss'],
})
export class DocumentsIssuedStateComponent implements OnInit {
  @Input() actually_action: Array<Report_Documents_ActuallyAction> = []; //Acción que se está ejecutando actualmente para vista
  @Input() total_OVs: number = 0; //Total de Operadores virtuales seleccionados

  constructor() {}

  ngOnInit(): void {}
}
