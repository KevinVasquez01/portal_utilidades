import { HostBinding, Injectable } from '@angular/core';
import { CompanyCreationLog, logs } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { CompanyUsers_Saphety, CompanyUsers_Saphety_Update, Roles_SaphetyI } from 'src/app/models/Company/Users';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServiceQA } from './apiget.service';

interface Distributor {
  Id: string,
  Name: string
}

@Injectable({
  providedIn: 'root'
})
export class CrearUsuariosService {

  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];

  constructor(private _getGetDataQA: APIGetServiceQA, private _AuthorizeCS: AuthorizeCompanyService) {
    this._AuthorizeCS.logCreateCompanies.subscribe((logs: CompanyCreationLog[]) => this.CompaniesCreated_Log = logs);
  }

  createUser(newUser: CompanyUsers_Saphety) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.NewUser(newUser).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  SearchUser(email: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.SearchUser(email).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  RolesUser(userId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.RolesUser(userId).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  EditUser(newUser: CompanyUsers_Saphety, userId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.EditUser(newUser, userId).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  Edit_RolUser(newUser: any, userId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.Edit_RolUser(newUser, userId).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  SearchcompanyRoles() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.SearchcompanyRoles().subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  Searchcompany(idCompany: string, virtualOperator: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetCompany(idCompany, virtualOperator).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  //Arma estructura de usuario para enviar
  ArmarUsuario(companyU: CompanyR_UC, virtualOperator: string, creation: CompanyCreationLog) {
    let newUser: CompanyUsers_Saphety = new CompanyUsers_Saphety();
    let companyUser = companyU.users.length > 0 ? companyU.users[0] : undefined;
    if (companyUser != undefined) {
      newUser.IsBlocked = false;
      newUser.Name = companyUser.name;
      newUser.Email = companyUser.email;
      newUser.Telephone = companyUser.telephone;
      newUser.IsBlocked = companyUser.isblocked;
      newUser.Timezone = companyUser.timezone;
      newUser.LanguageCode = companyUser.languagecode;
      newUser.CompanyMemberships = JSON.parse(companyUser.companymemberships);
      newUser.CompanyMemberships[0].CompanyId = creation.IdCompany_QA;
      newUser.CompanyMemberships[0].CompanyName = companyU.name;
      newUser.CompanyMemberships[0].Name = companyU.name;
      newUser.CompanyMemberships[0].VirtualOperatorId = virtualOperator;
      newUser.CompanyMemberships[0].Identification = { DocumentNumber: companyU.documentnumber, DocumentType: companyU.documenttype, CountryCode: companyU.countrycode, CheckDigit: companyU.checkdigit, Code: `${companyU.countrycode}_${companyU.documenttype}_${companyU.documentnumber}` };
    }
    return newUser;
  }

  //Usuario
  async CrearUsuario(companyU: CompanyR_UC, VirtualOperatorId: string, virtualOperatorName: string) {
    var creation = this.CompaniesCreated_Log.find(x => x.Company_Utilities.id === companyU.id) || new CompanyCreationLog();
    if (creation.IdCompany_PRD != '') {
      return;
    }

    if (creation.IdCompany_QA != '') {
      let User = this.ArmarUsuario(companyU, VirtualOperatorId, creation);
      if (User.Email != '') {
        await this.SearchcompanyRoles()
          .then(async data => {
            let companyRoles_list: Array<Distributor> = JSON.parse(JSON.stringify(data));
            let roles = User.CompanyMemberships[0].Roles;
            let newroles: Array<Roles_SaphetyI> = [];
            roles.forEach(async rol => {
              let rolQA = companyRoles_list.find(rolQA => rolQA.Name == rol.CompanyRoleName);
              if (rolQA != undefined) {
                rol.CompanyRoleId = rolQA.Id;
                newroles.push(rol);
              }
              else {
                await this.addLog(creation, 'Crear Usuario', false, `No fue posible añadir Rol ${rol.CompanyRoleName} al usuario ${User.Email}, dado que no existe en QA.`, false);
              }
            });
            User.CompanyMemberships[0].Roles = newroles;
          });

        await this.SearchUser(User.Email)
          .then(async result => {
            let users: Array<any> = JSON.parse(JSON.stringify(result));
            if (users.length > 0) {
              let IdUser = users[0]['Id'];
              let Status = users[0]['Status'];
              this.RolesUser(IdUser)
                .then(async result => {
                  let resultData: CompanyUsers_Saphety_Update = JSON.parse(JSON.stringify(result));

                  resultData.IsBlocked = false;
                  resultData.LanguageCode = User.LanguageCode;
                  resultData.Timezone = User.Timezone;
                  resultData.Id = IdUser;
                  resultData.Email = User.Email;
                  resultData.Name = User.Name;
                  resultData.Status = Status;
                  resultData.Telephone = User.Telephone;

                  resultData.CompanyMemberships.forEach(async cmember => {
                    await this.Searchcompany(cmember.CompanyId, virtualOperatorName)
                      .then(company => {
                        //Al consultar empresa
                        let Result_company: CompanySaphetyI = JSON.parse(JSON.stringify(company));
                        cmember.Name = Result_company.Name;
                        cmember.Identification = {
                          DocumentNumber: Result_company.Identification.DocumentNumber,
                          DocumentType: Result_company.Identification.DocumentType,
                          CountryCode: Result_company.Identification.CountryCode,
                          CheckDigit: Result_company.Identification.CheckDigit,
                          Code: `${Result_company.Identification.CountryCode}_${Result_company.Identification.DocumentType}_${Result_company.Identification.DocumentNumber}`
                        };
                      })
                  });

                  //Agrego company Nueva
                  resultData.CompanyMemberships.push(User.CompanyMemberships[0]);

                  //Edito Usuario
                  await this.EditUser(resultData, IdUser)
                    .then(async result => {
                      await this.addLog(creation, 'Editar Usuario', true, `Se Editó Usuario ${resultData.Email}, con éxito.`, true);
                      let newRol = { SystemMemberships: [], VirtualOperatorMemberships: [], CompanyMemberships: resultData.CompanyMemberships };
                      await this.Edit_RolUser(newRol, IdUser)
                        .then(async result => {
                          await this.addLog(creation, 'Editar Usuario', true, `Se editaron Roles de Usuario ${resultData.Email}, con éxito.`, true);
                        })
                        .catch(async error => {
                          await this.addLog(creation, 'Editar Usuario', false, `No fue posible Editar Roles de usuario ${resultData.Email}, Result: ${JSON.stringify(error)}.`, true);
                        });
                    })
                    .catch(async error => {
                      await this.addLog(creation, 'Editar Usuario', false, `No fue posible Editar usuario ${resultData.Email}, Result: ${JSON.stringify(error)}.`, true);
                    });
                })
                .catch(async error => {
                  await this.addLog(creation, 'Editar Usuario', false, `Ocurrió un error al consultar usuarios existentes, Result: ${JSON.stringify(error)}.`, true);
                });
            }
            else {
              await this.createUser(User)
                .then(async result => {
                  await this.addLog(creation, 'Crear Usuario', true, `Se Creó Usuario ${User.Email}, con éxito.`, true);
                })
                .catch(async error => {
                  await this.addLog(creation, 'Crear Usuario', false, `No fue posible Crear el Usuario ${User.Email}, Result: ${JSON.stringify(error)}.`, true)
                });
            }
          });
      }
    }
  }

  addLog(obj: CompanyCreationLog, modulo: string, status: boolean, message: string, isNecessary: boolean) {
    return new Promise((resolve) => {
      var indice = this.CompaniesCreated_Log.indexOf(obj);
      if (indice != -1) {
        let newLog: logs = { date: new Date(), module: modulo, message: message, status: status };
        obj.Messages_QA.push(newLog);
        obj.General_Result = isNecessary ? (obj.General_Result ? status : obj.General_Result) : obj.General_Result;

        //Elimino objeto a modificar
        this.CompaniesCreated_Log.splice(indice, 1);
        //Agrego nuevo objeto
        this.CompaniesCreated_Log.push(obj);
        this._AuthorizeCS.changelogCreateCompanies(this.CompaniesCreated_Log);
      }
      resolve(true);
    });
  }
}
