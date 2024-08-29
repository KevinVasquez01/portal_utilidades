import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompanyCreationLog } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from '../../models/Company-utilities/company-r';

@Injectable()
export class AuthorizeCompanyService {
  //Editando empresa?
  private edit = new BehaviorSubject<boolean>(false);
  public editing = this.edit.asObservable();

  //Empresa que se está editando
  private currentCompany_U = new BehaviorSubject<CompanyR_UC>(new CompanyR_UC());
  public currentCompany = this.currentCompany_U.asObservable();

  //Empresas pendientes
  private pendingCompany_U = new BehaviorSubject<CompanyR_UC[]>([]);
  public pendingCompanies_U = this.pendingCompany_U.asObservable();

  //Empresas por enviar
  private authCompany_U = new BehaviorSubject<CompanyR_UC[]>([]);
  public authCompanies = this.authCompany_U.asObservable();

  //Log de empresas creadas
  private logCreateCompany = new BehaviorSubject<CompanyCreationLog[]>([]);
  private mostrar_resultLog = new BehaviorSubject<boolean>(false);
  public logCreateCompanies = this.logCreateCompany.asObservable();
  public mostrar_resultsLog = this.mostrar_resultLog.asObservable();

  constructor() {}

  //Cambiar compañía que se está editando
  public changeEditingCompany(editing : boolean, currentCompany: CompanyR_UC): void {
    this.edit.next(editing);
    this.currentCompany_U.next(currentCompany);
  }

  //Cambiar compañías pendientes
  public changePendingCompany(PendingCompanies: CompanyR_UC[]): void {
    this.pendingCompany_U.next(PendingCompanies);
  }

  //Cambiar lista compañías por autorizar
  public changeCtoAuth(ListCompany: CompanyR_UC[]): void {
    this.authCompany_U.next(ListCompany);
  }

   //Cambiar lista compañías log creación
   public changelogCreateCompanies(Listlog: CompanyCreationLog[]): void {
    this.logCreateCompany.next(Listlog);
  }

   //Mostrar resultados de compañías creadas
   public changemostrar_resultsLog(mostrar: boolean): void {
    this.mostrar_resultLog.next(mostrar);
  }
}
