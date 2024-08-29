import { HostBinding, Injectable } from '@angular/core';
import {
  CompanyCreationLog,
  logs,
} from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { Packages, Packages_Items } from 'src/app/models/PackagesPRD/packages';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServicePRD } from './apiget.service';

export interface Tarifas {
  Id: string;
  Description: string;
  PlanType: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActivarPaquetesPRDService {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];

  constructor(
    private _getDataPRD: APIGetServicePRD,
    private _AuthorizeCS: AuthorizeCompanyService
  ) {
    this._AuthorizeCS.logCreateCompanies.subscribe(
      (logs) => (this.CompaniesCreated_Log = logs)
    );
  }

  createPaqueteE(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getDataPRD
        .ActivatePaqueteEmision(operatorvirtualId, companyId, tarifaId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }

  createPlanE(operatorvirtualId: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getDataPRD
        .ActivatePlanEmision(operatorvirtualId, companyId, tarifaId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }

  createPaqueteDS(
    operatorvirtual: string,
    companyId: string,
    tarifaId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getDataPRD
        .ActivatePaqueteEmisionDS(operatorvirtual, companyId, tarifaId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }

  createPlanDS(operatorvirtual: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getDataPRD
        .ActivatePlanEmisionDS(operatorvirtual, companyId, tarifaId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }

  createPaqueteN(operatorvirtual: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getDataPRD
        .CreatePaqueteNomina(operatorvirtual, companyId, tarifaId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }

  createPlanN(operatorvirtual: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getDataPRD
        .CreatePlanNomina(operatorvirtual, companyId, tarifaId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }

  activarPaqueteN(
    operatorvirtual: string,
    companyId: string,
    tarifa: Packages_Items
  ) {
    return new Promise((resolve, reject) => {
      this._getDataPRD
        .ActivatePaqueteNomina(operatorvirtual, companyId, tarifa.Id)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }

  async awaitPaqueteE(
    operatorvirtualId: string,
    creation: CompanyCreationLog,
    tarifa: Packages_Items
  ) {
    await this.createPaqueteE(
      operatorvirtualId,
      creation.IdCompany_PRD,
      tarifa.Id
    )
      .then(async () => {
        await this.log(
          creation,
          'Paquete Emision Facturación Electrónica',
          true,
          `Se creó paquete de Emisión: ${tarifa.Name}`,
          true
        );
      })
      .catch(async (err) => {
        await this.log(
          creation,
          'Paquete Emision Facturación Electrónica',
          false,
          `Error al crear paquete de Emisión: ${JSON.stringify(err)}`,
          true
        );
      });
  }

  async awaitPlanE(
    operatorvirtualId: string,
    creation: CompanyCreationLog,
    tarifa: Packages_Items
  ) {
    await this.createPlanE(operatorvirtualId, creation.IdCompany_PRD, tarifa.Id)
      .then(async () => {
        await this.log(
          creation,
          'Paln Emision Facturación Electrónica',
          true,
          `Se creó plan de Emisión: ${tarifa.Name}`,
          true
        );
      })
      .catch(async (err) => {
        await this.log(
          creation,
          'Plan Emision Facturación Electrónica',
          false,
          `Error al crear plan de Emisión: ${JSON.stringify(err)}`,
          true
        );
      });
  }

  async awaitPaqueteDS(
    operatorvirtual: string,
    creation: CompanyCreationLog,
    tarifa: Packages_Items
  ) {
    await this.createPaqueteDS(
      operatorvirtual,
      creation.IdCompany_PRD,
      tarifa.Id
    )
      .then(async () => {
        await this.log(
          creation,
          'Paquete Emision Documento Soporte',
          true,
          `Se creó paquete de Emisión: ${tarifa.Name}`,
          true
        );
      })
      .catch(async (err) => {
        await this.log(
          creation,
          'Paquete Emision Documento Soporte',
          false,
          `Error al crear paquete de Emisión: ${JSON.stringify(err)}`,
          true
        );
      });
  }

  async awaitPlanDS(
    operatorvirtual: string,
    creation: CompanyCreationLog,
    tarifa: Packages_Items
  ) {
    await this.createPlanDS(operatorvirtual, creation.IdCompany_PRD, tarifa.Id)
      .then(async () => {
        await this.log(
          creation,
          'Plan Emision Documento Soporte',
          true,
          `Se creó plan de Emisión: ${tarifa.Name}`,
          true
        );
      })
      .catch(async (err) => {
        await this.log(
          creation,
          'Plan Emision Documento Soporte',
          false,
          `Error al crear plan de Emisión: ${JSON.stringify(err)}`,
          true
        );
      });
  }

  async awaitPaqueteN(
    operatorvirtualAlias: string,
    creation: CompanyCreationLog,
    tarifa: Packages_Items
  ) {
    await this.createPaqueteN(
      operatorvirtualAlias,
      creation.IdCompany_PRD,
      tarifa.Id
    )
      .then(async () => {
        //await this.activarPaqueteN(operatorvirtualAlias, creation.IdCompany_PRD, tarifa);
        await this.log(
          creation,
          'Paquete Emision Nomina Electrónica',
          true,
          `Se creó paquete de Emisión: ${tarifa.Name}`,
          true
        );
      })
      .catch(async (err) => {
        await this.log(
          creation,
          'Paquete Emision Nomina Electrónica',
          false,
          `Error al crear paquete de Emisión: ${JSON.stringify(err)}`,
          true
        );
      });
  }

  async awaitPlanN(
    operatorvirtualAlias: string,
    creation: CompanyCreationLog,
    tarifa: Packages_Items
  ) {
    await this.createPlanN(
      operatorvirtualAlias,
      creation.IdCompany_PRD,
      tarifa.Id
    )
      .then(async () => {
        //await this.activarPaqueteN(operatorvirtualAlias, creation.IdCompany_PRD, tarifa);
        await this.log(
          creation,
          'Plan Emision Nomina Electrónica',
          true,
          `Se creó Plan de Emisión: ${tarifa.Name}`,
          true
        );
      })
      .catch(async (err) => {
        await this.log(
          creation,
          'Plan Emision Nomina Electrónica',
          false,
          `Error al crear Plan de Emisión: ${JSON.stringify(err)}`,
          true
        );
      });
  }

  //Crea paquetes emision Factura y/o Nomina
  async CrearPaqueteEmision(
    companyU: CompanyR_UC,
    operatorvirtual: string,
    operatorvirtualId: string,
    tarifas_to_create: Packages
  ) {
    var creation: CompanyCreationLog =
      this.CompaniesCreated_Log.find!(
        (x) => x.Company_Utilities.id === companyU.id
      ) || new CompanyCreationLog();

    if (creation.IdCompany_PRD != '') {
      //Paquetes facturación y recepción
      if (
        (!companyU.dataCreations[0].salesinvoice_included && !companyU.dataCreations[0].reception_salesinvoice_included) ||
        tarifas_to_create.FE.length == 0
      ) {
        await this.log(
          creation,
          'Paquete Emision/Recepción Facturación Electrónica',
          true,
          'No se creó paquete de Emisión, dado que el usuario no seleccionó servicio de Facturación Electrónica, ni de recepción Electrónica.',
          false
        );
      } else {
        for (let i = 0; i < tarifas_to_create.FE.length; i++) {
          if (tarifas_to_create.FE[i].Type == 'Postpaid') {
            await this.awaitPlanE(
              operatorvirtualId,
              creation,
              tarifas_to_create.FE[i]
            );
          } else if (tarifas_to_create.FE[i].Type == 'Prepaid') {
            await this.awaitPaqueteE(
              operatorvirtualId,
              creation,
              tarifas_to_create.FE[i]
            );
          }
        }
      }

      //Paquetes documento soporte
      if (
        !companyU.dataCreations[0].documentsuport_included ||
        tarifas_to_create.DS.length == 0
      ) {
        await this.log(
          creation,
          'Paquete Emision Documento Soporte',
          true,
          'No se creó paquete de Emisión, dado que el usuario no seleccionó servicio de Documento Soporte.',
          false
        );
      } else {
        for (let i = 0; i < tarifas_to_create.DS.length; i++) {
          if (tarifas_to_create.DS[i].Type == 'Postpaid') {
            await this.awaitPlanDS(
              operatorvirtual,
              creation,
              tarifas_to_create.DS[i]
            );
          } else if (tarifas_to_create.DS[i].Type == 'Prepaid') {
            await this.awaitPaqueteDS(
              operatorvirtual,
              creation,
              tarifas_to_create.DS[i]
            );
          }
        }
      }

      //Paquetes nómina electrónica
      if (
        companyU.dataCreations[0].payrroll_included == false ||
        tarifas_to_create.NE.length == 0
      ) {
        await this.log(
          creation,
          'Paquete Emision Nomina Electrónica',
          false,
          'No se creó paquete de Nómina electrónica, dado que el usuario no seleccionó el servicio.',
          false
        );
      } else {
        for (let i = 0; i < tarifas_to_create.NE.length; i++) {
          if (tarifas_to_create.NE[i].Type == 'Postpaid') {
            await this.awaitPlanN(
              operatorvirtual,
              creation,
              tarifas_to_create.NE[i]
            );
          } else if (tarifas_to_create.NE[i].Type == 'Prepaid') {
            await this.awaitPaqueteN(
              operatorvirtual,
              creation,
              tarifas_to_create.NE[i]
            );
          }
        }
      }
    }
  }

  newLog(modulo: string, status: boolean, message: string) {
    let newLog: logs = {
      date: new Date(),
      module: modulo,
      message: message,
      status: status,
    };
    return newLog;
  }

  log(
    obj: CompanyCreationLog,
    modulo: string,
    status: boolean,
    message: string,
    isNecessary: boolean
  ) {
    return new Promise((resolve) => {
      var indice = this.CompaniesCreated_Log.indexOf(obj);
      if (indice != -1) {
        let newLog: logs = {
          date: new Date(),
          module: modulo,
          message: message,
          status: status,
        };
        //Mensaje producción
        obj.Messages_PRD.push(newLog);
        obj.General_Result = isNecessary
          ? obj.General_Result
            ? status
            : obj.General_Result
          : obj.General_Result;

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
