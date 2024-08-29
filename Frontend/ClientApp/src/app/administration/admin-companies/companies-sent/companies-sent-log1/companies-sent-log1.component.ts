import { Component, Input, OnInit } from '@angular/core';
import { logs } from 'src/app/models/Company-utilities/company-creation-log';

@Component({
  selector: 'app-companies-sent-log1',
  templateUrl: './companies-sent-log1.component.html',
  styleUrls: ['./companies-sent-log1.component.scss']
})
export class CompaniesSentLog1Component implements OnInit {
  @Input() messages: logs[] = [];
  @Input() ambiente: string = '';
  displayedColumns = ['date', 'module', 'message', 'status'];
  dataSource: logs[] = this.messages;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = this.messages;
  }

  mostrarlog(){
    //console.log(this.dataSource);
  }

}
