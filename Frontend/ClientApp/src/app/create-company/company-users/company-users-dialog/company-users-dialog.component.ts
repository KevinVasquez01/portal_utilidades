import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { companyRoles_Description } from 'src/app/models/dataElmenets-utilities/company-roles-utilities';

@Component({
  selector: 'app-company-users-dialog',
  templateUrl: './company-users-dialog.component.html',
  styleUrls: ['../company-users.scss']
})
export class CompanyUsersDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: companyRoles_Description) {}
  ngOnInit(): void {
  }
}
