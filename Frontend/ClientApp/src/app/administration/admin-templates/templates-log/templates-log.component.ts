import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Template_log } from 'src/app/models/Templates/templates';

@Component({
  selector: 'app-templates-log',
  templateUrl: './templates-log.component.html',
  styleUrls: ['./templates-log.component.scss']
})
export class TemplatesLogComponent implements OnInit {
  @Input() messages: Template_log[] = [];
  @Output() datasaliente: EventEmitter<boolean> = new EventEmitter();
  displayedColumns = ['date', 'module', 'message', 'status'];
  dataSource: Template_log[] = this.messages;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = this.messages;
  }

  close(){
    this.datasaliente.emit(false);
    this.dataSource = [];

  }

}
