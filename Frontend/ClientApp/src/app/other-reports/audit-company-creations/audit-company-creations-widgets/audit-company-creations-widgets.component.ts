import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-company-creations-widgets',
  templateUrl: './audit-company-creations-widgets.component.html',
  styleUrls: ['./audit-company-creations-widgets.component.scss']
})
export class AuditCompanyCreationsWidgetsComponent implements OnInit {

  @Input() data: string[] = ['','','','', '', ''];

  size = 25;
  showall = true;

  constructor() { }

  ngOnInit(): void {
    if(this.data[0] != '0' && this.data[3] != '0'){
      this.size = 25;
      this.showall = true;
    }
    else{
      this.size = 50;
      this.showall = false;
    }
  }

}
