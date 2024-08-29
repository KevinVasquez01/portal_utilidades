import { Component, Input, OnInit } from '@angular/core';
import { logs } from 'src/app/models/Company-utilities/company-creation-log';

@Component({
  selector: 'app-sent-logs',
  templateUrl: './sent-logs.component.html',
  styleUrls: ['./sent-logs.component.css']
})
export class SentLogsComponent implements OnInit {
  @Input() messages: logs[] = [];
  displayedColumns = ['date', 'module', 'message', 'status'];
  dataSource: logs[] = this.messages;

  ngOnInit(): void {
    this.dataSource = this.messages;
  }
}
