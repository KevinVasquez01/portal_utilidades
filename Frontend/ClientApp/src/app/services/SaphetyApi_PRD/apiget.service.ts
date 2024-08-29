import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jsonItemsI } from 'src/app/models/Jsonformat/jsonItems';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { ResponseI } from 'src/app/models/response.interface';
import { Observable } from 'rxjs';
import { TemplateSaphetyI } from 'src/app/models/Templates/templateSaphety';
import { SeriesHDian } from 'src/app/models/SeriesHDian/SeriesHDian';
import { CompanyUsers_Saphety } from 'src/app/models/Company/Users';
import { SeriesEmisionC } from 'src/app/models/SeriesEmision/SeriesEmision';
import { delay, retry } from 'rxjs/operators';

declare var require: any;
const jsonPRD = require('src/assets/json/SaphetyPRD.json');

@Injectable({
  providedIn: 'root',
})
export class APIGetServicePRD {
  constructor(private http: HttpClient) {}

  directionService(direction: string, type: string) {
    let dirservice = '';
    //Obtiene servicio para PRD
    let url = jsonPRD['Root'];
    let jsonvalorget: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonPRD[type])
    );
    let dir = jsonvalorget.find((option) => option.key == direction);
    dirservice = url + dir?.value;
    return dirservice;
  }

  GetDataElement(direction: string) {
    //Obtiene la dirección del servicio gettoken de Saphety
    let dirservice = this.directionService(direction, 'GET');
    return this.http.get<any>(dirservice);
  }

  GetVirtualOperators(bodyvalue: findvirtualoperatorI): Observable<ResponseI> {
    let token = localStorage.getItem('token');
    const headers = {
      Authorization: 'Bearer ' + token,
      'My-Custom-Header': 'foobar',
    };
    const body = { title: bodyvalue };
    //Obtiene la dirección del servicio gettoken de Saphety
    let direction = this.directionService('virtualOperators', 'POST');
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, body, { headers });
  }

  NewCompany(body: any, opv: string): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    var direction = `${url}${opv}/companies`;
    return this.http.post<ResponseI>(direction, body, options);
  }

  SearchDistributors(body: any): Observable<ResponseI> {
    //Obtiene la dirección del servicio searchdistributors de Saphety
    let direction = this.directionService('searchdistributors', 'POST');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.post<ResponseI>(direction, body, options);
  }

  SearchcompanyRoles(): Observable<ResponseI> {
    //Obtiene la dirección del servicio companyRoles de Saphety
    let direction = this.directionService('companyRoles', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  GetCompanies(bodyvalue: any, virtualOperator: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, bodyvalue, options).pipe(
      retry(10), // you retry 10 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  //Templates
  SearchDocumentTypesSalesInvoice(): Observable<ResponseI> {
    //Obtiene la dirección del servicio companyRoles de Saphety
    let direction = this.directionService('DocumentTypesSalesInvoice', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  SearchDocumentSubTypesSalesInvoice(): Observable<ResponseI> {
    //Obtiene la dirección del servicio companyRoles de Saphety
    let direction = this.directionService(
      'DocumentSubTypesSalesInvoice',
      'GET'
    );
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  SearchDocumentTypesPayRoll(): Observable<ResponseI> {
    //Obtiene la dirección del servicio companyRoles de Saphety
    let direction = this.directionService('DocumentTypesPayRoll', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  NewTemplateSalesInvoice(
    template: TemplateSaphetyI,
    opvName: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/companies/${companyId}/pdftemplates`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, template, options);
  }

  ActivateTemplateSalesInvoice(
    opvName: string,
    companyId: string,
    templateId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/companies/${companyId}/pdftemplates/${templateId}/default/true`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, null, options);
  }

  NewTemplatePayRoll(
    template: TemplateSaphetyI,
    opvName: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/companies/${companyId}/pdftemplates/payroll`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, template, options);
  }

  ActivateTemplatePayRoll(
    opvName: string,
    companyId: string,
    templateId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/companies/${companyId}/pdftemplates/payroll/${templateId}/default/true`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, null, options);
  }

  NewSerieHDian(
    serie: SeriesHDian,
    virtualOperator: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/qualificationseries`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, serie, options);
  }

  UpdateSerieHDian(
    serie: SeriesHDian,
    virtualOperator: string,
    companyId: string,
    idSerie: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/qualificationseries/${idSerie}`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, serie, options);
  }

  SearchSerieHDian(
    virtualOperator: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/qualificationseries/getall`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  SearchUser(email: string): Observable<ResponseI> {
    let user = {
      Offset: 0,
      NumberOfRecords: 20,
      SortField: '-CreationDate',
      Email: email,
    };
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    //Obtiene la dirección del servicio users_search de Saphety
    let direction = this.directionService('users_search', 'POST');
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, user, options);
  }

  RolesUser(userId: string): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}users/${userId}/roles`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  NewUser(newUser: CompanyUsers_Saphety): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}users`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, newUser, options);
  }

  EditUser(
    newUser: CompanyUsers_Saphety,
    userId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}users/${userId}`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, newUser, options);
  }

  Edit_RolUser(
    newUser: CompanyUsers_Saphety,
    userId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}users/${userId}/roles`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, newUser, options);
  }

  GetCompany(idCompany: string, virtualOperator: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${idCompany}`;
    //Devuelve respuesta
    return this.http.get<any>(direction, options);
  }

  ActivatePaqueteEmision(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/companies/${companyId}/addPrepaidDocumentPackage/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePlanEmision(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/companies/${companyId}/addCompanyPostPaidDocumentPlan/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePaqueteEmisionDS(
    operatorvirtual: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportdocumentplans/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePlanEmisionDS(
    operatorvirtual: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportdocumentplans/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  RemovePaqueteEmision(
    operatorvirtualId: string,
    companyId: string,
    packageId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/companies/${companyId}/removePrepaidDocumentPackage/${packageId}`;
    //Devuelve respuesta
    return this.http.delete<ResponseI>(direction, options);
  }

  SearchPaqueteEmision(
    virtualOperator: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/companies/${companyId}/companypostpaiddocumentplans`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  SearchPlanEmision(
    virtualOperator: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/companies/${companyId}/prepaiddocumentpackagepurchases`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  SearchPaqueteEmisionDS(
    virtualOperator: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let request = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/supportdocumentpackages/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  SearchPlanEmisionDS(
    virtualOperator: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let request = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/supportdocumentplans/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  SearchPaqueteEmisionNE(
    virtualOperator: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let request = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/payrollpackages/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  SearchPlanEmisionNE(
    virtualOperator: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let request = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/payrollplans/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  CreatePaqueteNomina(
    operatorvirtualAlias: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualAlias}/payrollpackages/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  CreatePlanNomina(
    operatorvirtualAlias: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualAlias}/payrollplans/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePaqueteNomina(
    operatorvirtual: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/payrollmodule/${operatorvirtual}/${companyId}/setCompanyPayrollIssuingService/true`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePaqueteDS(companyId: string, operatorvirtualId : string): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/supportdocumentplans/companies/${companyId}/setCompanySupportDocumentIssuingService/true`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  SearchPaqueteNomina(
    virtualOperator: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/payrollpackages/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    let body = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, body, options);
  }

  FindTarifaPostPaid_FE(operatorvirtualId: string): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/postpaiddocumentplans?isEnabled=true`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  FindTarifaPrePaid_FE(operatorvirtualId: string): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/prepaiddocumentpackageproducts/forassociation`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  FindTarifaPostPaid_DS(operatorvirtual: string): Observable<ResponseI> {
    let request = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportDocumentplans/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  FindTarifaPrePaid_DS(operatorvirtual: string): Observable<ResponseI> {
    let request = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportDocumentpackages/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  FindTarifaPostPaid_DE(OVAlias: string): Observable<ResponseI> {
    let user = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${OVAlias}/equivalentdocumentplans/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, user, options);
  }

  FindTarifaPrePaid_DE(OVAlias: string): Observable<ResponseI> {
    let user = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${OVAlias}/equivalentdocumentpackages/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, user, options);
  }

  FindTarifaPostPaid_NE(OVAlias: string): Observable<ResponseI> {
    let user = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${OVAlias}/payrollplans/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, user, options);
  }

  FindTarifaPrePaid_NE(OVAlias: string): Observable<ResponseI> {
    let user = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${OVAlias}/payrollpackages/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, user, options);
  }

  SearchSerieEmisionDocumentTypes(): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}dataelements/SerieDocumentTypes`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  NewSerieEmision(
    serie: SeriesEmisionC,
    virtualOperator: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/series`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, serie, options);
  }

  ActivateSerieEmision(
    virtualOperator: string,
    companyId: string,
    serieId: string
  ): Observable<ResponseI> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/series/${serieId}/activate`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, null, options);
  }

  virtualOperatorCompanyActivationPlans(
    virtualOperatorId: string
  ): Observable<ResponseI> {
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperatorId}/virtualOperatorCompanyActivationPlans/search`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options).pipe(
      retry(30), // you retry 30 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  EnablementCreateFV(dto: JSON, opvName: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/qualificationoutbounddocuments/salesInvoiceAsync`;
    //Devuelve respuesta
    return this.http.post<any>(direction, dto, options);
  }

  EnablementCreateNC(dto: JSON, opvName: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/qualificationoutbounddocuments/creditNoteAsync`;
    //Devuelve respuesta
    return this.http.post<any>(direction, dto, options);
  }

  EnablementCreateND(dto: JSON, opvName: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/qualificationoutbounddocuments/debitNoteAsync`;
    //Devuelve respuesta
    return this.http.post<any>(direction, dto, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  EnablementSyncStatus(opvName: string, documentId: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/qualificationoutbounddocuments/${documentId}/syncstatus`;
    //Devuelve respuesta
    return this.http.put<any>(direction, null, options);
  }

  EnablementSearchDocuments(
    opvName: string,
    IssueStartDate: Date,
    IssueEndDate: Date,
    TestSetId: string
  ): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let dto = {
      IssueStartDate: IssueStartDate,
      IssueEndDate: IssueEndDate,
      TestSetId: TestSetId,
    };
    let options = { headers: headers };
    let direction = `${url}${opvName}/qualificationoutbounddocuments/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, dto, options);
  }

  GetDocumentStatusFE(): Observable<ResponseI> {
    //Obtiene la dirección del servicio invoicestagingdocumentstatus de Saphety
    let direction = this.directionService(
      'invoicestagingdocumentstatus',
      'GET'
    );
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  SearchDocumentStatusFE(Json: any): Observable<any> {
    //Obtiene la dirección del servicio searchinvoicestagingdocumentstatus de Saphety
    let direction = this.directionService(
      'searchinvoicestagingdocumentstatus',
      'POST'
    );
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    //Devuelve respuesta
    return this.http.post<any>(direction, Json, options);
  }

  RecoveryDocumentStatusFE(
    OVAlias: string,
    DocumentId: string
  ): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/outbounddocuments/recover/staging/${DocumentId}`;
    //Devuelve respuesta
    return this.http.post<any>(direction, null, options);
  }

  GetDocumentStatusNE(): Observable<ResponseI> {
    //Obtiene la dirección del servicio payrollstagingdocumentstatus de Saphety
    let direction = this.directionService(
      'payrollstagingdocumentstatus',
      'GET'
    );
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  SearchDocumentStatusNE(Json: any): Observable<any> {
    //Obtiene la dirección del servicio searchpayrollstagingdocumentstatus de Saphety
    let direction = this.directionService(
      'searchpayrollstagingdocumentstatus',
      'POST'
    );
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    //Devuelve respuesta
    return this.http.post<any>(direction, Json, options);
  }

  RecoveryDocumentStatusNE(
    OVAlias: string,
    DocumentId: string
  ): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/payroll/recover/staging/${DocumentId}`;
    //Devuelve respuesta
    return this.http.post<any>(direction, null, options);
  }

  GetOutbounddocumentsNumber(body: any, OVAlias: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/outbounddocuments/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetInbounddocumentsNumber(body: any, OVAlias: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/inbounddocuments/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetPayrollNumber(body: any, OVAlias: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/payroll/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetOutbounddocuments(body: any, OVAlias: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/outbounddocuments/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetInbounddocuments(body: any, OVAlias: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/inbounddocuments/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetPayroll(body: any, OVAlias: string): Observable<any> {
    let url = jsonPRD['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/payroll/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }
}
