import { Component, OnInit } from '@angular/core';
import {
  Enablement_Companies,
  Enablement_status,
} from 'src/app/models/Enablement/Enablement';

@Component({
  selector: 'app-enablement-fe',
  templateUrl: './enablement-fe.component.html',
  styleUrls: ['./enablement-fe.component.scss'],
})
export class EnablementFEComponent implements OnInit {
  companies_for_enablement: Array<Enablement_Companies> = [];

  companies_status: Enablement_status = {
    status: [],
  };

  constructor() {}
  ngOnInit(): void {}

  receive_companies_for_enablement(companies: Array<Enablement_Companies>) {
    companies.forEach((company) => {
      let find = this.companies_for_enablement.find(
        (x) => x.company_excel.Nit === company.company_excel.Nit
      );
      if (find === undefined) {
        this.companies_for_enablement.push(company);
      }
    });
  }

  receive_companies_status(enablement_status: Enablement_status) {
    this.companies_status = enablement_status;
  }

  receive_log_close(close: boolean) {
    this.companies_for_enablement = [];
    this.companies_status = {
      status: [],
    };
  }
}
