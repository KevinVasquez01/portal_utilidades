import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jsonItemsI } from 'src/app/models/Jsonformat/jsonItems';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { ResponseI } from 'src/app/models/response.interface';
import { Observable, throwError } from 'rxjs';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SeriesHDian } from 'src/app/models/SeriesHDian/SeriesHDian';
import { SeriesEmisionC } from 'src/app/models/SeriesEmision/SeriesEmision';
import { CompanyUsers_Saphety } from 'src/app/models/Company/Users';
import { TemplateSaphetyI } from 'src/app/models/Templates/templateSaphety';
import { delay, retry } from 'rxjs/operators';

declare var require: any;
const jsonQA = require('src/assets/json/SaphetyQA.json');

@Injectable({
  providedIn: 'root',
})
export class APIGetServiceQA {
  constructor(private http: HttpClient) {}

  directionService(direction: string, type: string) {
    let dirservice = '';
    //Obtiene servicio para QA
    let url = jsonQA['Root'];
    let jsonvalorget: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonQA[type])
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
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let body = { title: bodyvalue };
    let options = { headers: headers };
    //Obtiene la dirección del servicio gettoken de Saphety
    let direction = this.directionService('virtualOperators', 'POST');
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, body, options);
  }

  GetVirtualOperators_QA(
    bodyvalue: findvirtualoperatorI
  ): Observable<ResponseI> {
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let body = { title: bodyvalue };
    let options = { headers: headers };
    //Obtiene la dirección del servicio gettoken de Saphety
    let direction = this.directionService('virtualOperators', 'POST');
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, body, options);
  }

  GetCompanies(bodyvalue: any, virtualOperator: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, bodyvalue, options);
  }

  GetCompaniestoSearch(
    bodyvalue: any,
    virtualOperator: string
  ): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, bodyvalue, options);
  }

  GetCompaniestoSearch_QA(
    bodyvalue: any,
    virtualOperator: string
  ): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/search`;
    //Devuelve respuesta
    return this.http.post<any>(direction, bodyvalue, options).pipe(
      retry(30), // you retry 30 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetCompany(idCompany: string, virtualOperator: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${idCompany}`;
    //Devuelve respuesta
    return this.http.get<any>(direction, options);
  }

  NewCompany(company: CompanySaphetyI, opv: string): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    var direction = `${url}${opv}/companies`;
    return this.http.post<ResponseI>(direction, company, options);
  }

  NewSerieHDian(
    serie: SeriesHDian,
    virtualOperator: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = '';
    if (localStorage.getItem('ambient') == 'QA') {
      token = localStorage.getItem('token') || '';
    } else {
      token = GlobalConstants.tokenUserQA;
    }
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = '';
    if (localStorage.getItem('ambient') == 'QA') {
      token = localStorage.getItem('token') || '';
    } else {
      token = GlobalConstants.tokenUserQA;
    }
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/qualificationseries/getall`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  SearchSerieEmisionDocumentTypes(): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/series`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, serie, options);
  }

  SearchSerieEmision(
    virtualOperator: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/series/getall`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  ActivateSerieEmision(
    virtualOperator: string,
    companyId: string,
    serieId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${virtualOperator}/companies/${companyId}/series/${serieId}/activate`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, null, options);
  }

  ActivatePaqueteEmision(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportdocumentpackages/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  SearchPaqueteEmision(
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperatorId}/companies/${companyId}/companypostpaiddocumentplans`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  SearchPlanEmision(
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperatorId}/companies/${companyId}/prepaiddocumentpackagepurchases`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  CreatePaqueteNomina(
    operatorvirtual: string,
    companyId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/payrollpackages/companies/${companyId}/c463cbc9-3c37-ec11-a2d6-00505695a8eb`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePaqueteNomina(companyId: string, operatorvirtualId : string): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/payrollmodule/${operatorvirtualId}/${companyId}/setCompanyPayrollIssuingService/true`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePaqueteDS(companyId: string, operatorvirtualId : string): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/payrollpackages/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    let body = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, body, options);
  }

  SearchPaqueteEmisionDS(
    virtualOperator: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let request = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    let url = this.directionService('serviceoffercontrol', 'POST');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
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
    let url = this.directionService('serviceoffercontrol', 'POST');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperator}/supportdocumentplans/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  SearchPaqueteEmisionNE(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let request = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    let url = this.directionService('serviceoffercontrol', 'POST');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperatorAlias}/payrollpackages/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  SearchPlanEmisionNE(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ): Observable<ResponseI> {
    let request = { CompanyId: companyId, VirtualOperatorId: virtualOperatorId };
    let url = this.directionService('serviceoffercontrol', 'POST');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperatorAlias}/payrollplans/companies/${companyId}/search?NumberOfRecords=undefined&Offset=undefined`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  FindTarifaPostPaid_FE(operatorvirtualId: string): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/postpaiddocumentplans?isEnabled=true`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  FindTarifaPrePaid_FE(operatorvirtualId: string): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportDocumentpackages/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  FindTarifaPostPaid_NE(OVAlias: string): Observable<ResponseI> {
    let user = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${OVAlias}/payrollpackages/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, user, options);
  }

  FindTarifa(operatorvirtualId: string): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/postpaiddocumentplans?isEnabled=true`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  FindTarifaDS(operatorvirtual: string): Observable<ResponseI> {
    let request = { Offset: 0, NumberOfRecords: 999 };
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportdocumentpackages/search`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, request, options);
  }

  SearchUser(email: string): Observable<ResponseI> {
    let user = {
      Offset: 0,
      NumberOfRecords: 20,
      SortField: '-CreationDate',
      Email: email,
    };
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}users/${userId}/roles`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  NewUser(newUser: CompanyUsers_Saphety): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}users/${userId}/roles`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, newUser, options);
  }

  SearchDistributors(body: any): Observable<ResponseI> {
    //Obtiene la dirección del servicio searchdistributors de Saphety
    let direction = this.directionService('searchdistributors', 'POST');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  //Templates
  SearchDocumentTypesSalesInvoice(): Observable<ResponseI> {
    //Obtiene la dirección del servicio companyRoles de Saphety
    let direction = this.directionService('DocumentTypesSalesInvoice', 'GET');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/companies/${companyId}/pdftemplates/payroll/${templateId}/default/true`;
    //Devuelve respuesta
    return this.http.put<ResponseI>(direction, null, options);
  }

  virtualOperatorCompanyActivationPlans(
    virtualOperatorId: string
  ): Observable<ResponseI> {
    let url = this.directionService('serviceoffercontrol', 'GET');
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}/${virtualOperatorId}/virtualOperatorCompanyActivationPlans/search`;
    //Devuelve respuesta
    return this.http.get<ResponseI>(direction, options);
  }

  EnablementCreateFV(dto: JSON, opvName: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/qualificationoutbounddocuments/salesInvoiceAsync`;
    //Devuelve respuesta
    return this.http.post<any>(direction, dto, options);
  }

  EnablementCreateNC(dto: JSON, opvName: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${opvName}/qualificationoutbounddocuments/creditNoteAsync`;
    //Devuelve respuesta
    return this.http.post<any>(direction, dto, options);
  }

  EnablementCreateND(dto: JSON, opvName: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  SearchDocumentStatusFE(
    Json: any
  ): Observable<any> {
    //Obtiene la dirección del servicio searchinvoicestagingdocumentstatus de Saphety
    let direction = this.directionService(
      'searchinvoicestagingdocumentstatus',
      'POST'
    );
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    //Devuelve respuesta
    return this.http.post<any>(direction, Json, options);
  }

  GetDocumentStatusNE(): Observable<ResponseI> {
    //Obtiene la dirección del servicio payrollstagingdocumentstatus de Saphety
    let direction = this.directionService(
      'payrollstagingdocumentstatus',
      'GET'
    );
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.get<ResponseI>(direction, options);
  }

  RecoveryDocumentStatusFE(
    OVAlias: string,
    DocumentId: string
  ): Observable<any> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/outbounddocuments/recover/staging/${DocumentId}`;
    //Devuelve respuesta
    return this.http.post<any>(direction, null, options);
  }

  SearchDocumentStatusNE(
    Json: any
  ): Observable<any> {
    //Obtiene la dirección del servicio searchpayrollstagingdocumentstatus de Saphety
    let direction = this.directionService(
      'searchpayrollstagingdocumentstatus',
      'POST'
    );
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
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
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}${OVAlias}/payroll/recover/staging/${DocumentId}`;
    //Devuelve respuesta
    return this.http.post<any>(direction, null, options);
  }

  CreatePaqueteNomina_QA(
    operatorvirtualAlias: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualAlias}/payrollpackages/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  CreatePlanNomina_QA(
    operatorvirtualAlias: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualAlias}/payrollplans/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePaqueteEmisionDS_QA(
    operatorvirtual: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportdocumentplans/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePlanEmisionDS_QA(
    operatorvirtual: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtual}/supportdocumentplans/companies/${companyId}/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePaqueteEmision_QA(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/companies/${companyId}/addPrepaidDocumentPackage/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }

  ActivatePlanEmision_QA(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ): Observable<ResponseI> {
    let url = jsonQA['Root'];
    let token = GlobalConstants.tokenUserQA != '' ? GlobalConstants.tokenUserQA : localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${operatorvirtualId}/companies/${companyId}/addCompanyPostPaidDocumentPlan/${tarifaId}`;
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, null, options);
  }
}
