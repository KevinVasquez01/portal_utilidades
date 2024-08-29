import { NgModule } from '@angular/core';
/* Create Company */
import { CompanyContactComponent } from './company-contact/company-contact.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { CompanyOtherInfoComponent } from './company-other-info/company-other-info.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { CompanyUsersDialogComponent } from './company-users/company-users-dialog/company-users-dialog.component';
import { CreateCompanyComponent } from './create-company.component';

import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CreateCompanyRoutes } from './create-company.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreateCompanyRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
  ],
  declarations: [
    /* Create Company */
    CreateCompanyComponent,
    CompanyContactComponent,
    CompanyInformationComponent,
    CompanyOtherInfoComponent,
    CompanyUsersComponent,
    CompanyUsersDialogComponent,
  ],
  exports: [
    /* Create Company */
    CreateCompanyComponent,
    CompanyContactComponent,
    CompanyInformationComponent,
    CompanyOtherInfoComponent,
    CompanyUsersComponent,
    CompanyUsersDialogComponent,
  ],
  providers: []
})
export class CreateCompanyModule { }
