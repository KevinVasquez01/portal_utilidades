import { Component, OnInit } from '@angular/core';
import { PlanPackage_Companies_Log } from 'src/app/models/PackagesPRD/massiveplanspackages';

@Component({
  selector: 'app-massiveplanspackages',
  templateUrl: './massive-plans-packages.component.html',
  styleUrls: ['./massive-plans-packages.component.scss']
})
export class MassiveplanspackagesComponent implements OnInit {

  companies_load: Array<PlanPackage_Companies_Log> = [];
  companies_result: Array<PlanPackage_Companies_Log> = [];
  paso = 0;

  constructor() { }

  ngOnInit(): void {
  }

  receiveLoadCompany(companies: Array<PlanPackage_Companies_Log>) {
    this.companies_load = companies;
    this.paso = 1;
  }

  receiveSelectClose(close : boolean){
    this.paso = 0;
  }

  receiveSelectResults(companies: Array<PlanPackage_Companies_Log>){
    this.companies_result = companies;
    this.paso = 2;
  }

  receiveResultsClose(close : boolean){
    this.paso = 0;
  }

}
