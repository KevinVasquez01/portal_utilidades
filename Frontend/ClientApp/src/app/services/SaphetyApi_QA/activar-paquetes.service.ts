import { HostBinding, Injectable } from '@angular/core';
import {
  CompanyCreationLog,
  logs,
} from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServiceQA } from './apiget.service';

export interface Tarifas {
  Id: string;
  Description: string;
  PlanType: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActivarPaquetesService {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];

  constructor(
    private _getGetDataQA: APIGetServiceQA,
    private _AuthorizeCS: AuthorizeCompanyService
  ) {
    this._AuthorizeCS.logCreateCompanies.subscribe(
      (logs) => (this.CompaniesCreated_Log = logs)
    );
  }

  BuscarTarifa(operatorvirtualId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.FindTarifa(operatorvirtualId).subscribe(
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

  BuscarTarifaDS(operatorvirtual: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.FindTarifaDS(operatorvirtual).subscribe(
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

  createPaqueteE(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
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

  createPaqueteN(operatorvirtual: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .CreatePaqueteNomina(operatorvirtual, companyId)
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

  activarPaqueteN(companyId: string, operatorvirtualId : string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.ActivatePaqueteNomina(companyId, operatorvirtualId).subscribe(
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

  activarPaqueteDS(companyId: string, OperatorId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.ActivatePaqueteDS(companyId, OperatorId).subscribe(
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

  searchPaqueteE(operatorvirtualId: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPaqueteEmision(operatorvirtualId, companyId)
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

  searchPaqueteDS(operatorvirtual: string, virtualOperatorId: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPaqueteEmisionDS(operatorvirtual, virtualOperatorId, companyId)
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
      this._getGetDataQA
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

  searchPaqueteN(
    operatorvirtualName: string,
    operatorvirtualId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPaqueteNomina(operatorvirtualName, operatorvirtualId, companyId)
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
    companyU: CompanyR_UC,
    operatorvirtualId: string,
    result: any,
    creation: CompanyCreationLog
  ) {
    let planes: Array<any> = JSON.parse(JSON.stringify(result));
    if (planes.length > 0) {
      let name = planes[0]['Name'] || '';
      await this.log(
        creation,
        'Paquete Emision Facturación Electrónica',
        true,
        `La empresa ya cuenta con un paquete de Emisión: ${name}`,
        true
      );
    } else {
      await this.BuscarTarifa(operatorvirtualId)
        .then(async (tarifa) => {
          let tarifas: Tarifas[] = JSON.parse(JSON.stringify(tarifa));
          let tarifaOutbound = tarifas.find((x) => x.PlanType == 'Outbound');
          let tarifaInbound: Tarifas | undefined;

          await this.createPaqueteE(
            operatorvirtualId,
            creation.IdCompany_QA,
            String(tarifaOutbound?.Id)
          )
            .then(async (datareceive) => {
              await this.log(
                creation,
                'Paquete Emision Facturación Electrónica',
                true,
                `Se creó paquete de Emisión: ${String(datareceive)}`,
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

            if(companyU.dataCreations[0].reception_salesinvoice_included){
              tarifaInbound = tarifas.find((x) => x.PlanType == 'Inbound');

              await this.createPaqueteE(
                operatorvirtualId,
                creation.IdCompany_QA,
                String(tarifaInbound?.Id)
              )
                .then(async (datareceive) => {
                  await this.log(
                    creation,
                    'Paquete Recepción Facturación Electrónica',
                    true,
                    `Se creó paquete de Recepción: ${String(datareceive)}`,
                    true
                  );
                })
                .catch(async (err) => {
                  await this.log(
                    creation,
                    'Paquete Recepción Facturación Electrónica',
                    false,
                    `Error al crear paquete de Recepción: ${JSON.stringify(err)}`,
                    true
                  );
                });
            }

        })
        .catch(async (err) => {
          await this.log(
            creation,
            'Paquete Emision Facturación Electrónica',
            false,
            `Error al crear paquete de Emisión, no se encontró una tarifa: ${JSON.stringify(
              err
            )}`,
            true
          );
        });
    }
  }

  async awaitPaqueteDS(
    operatorvirtual: string,
    operatorvirtualId: string,
    result: any,
    creation: CompanyCreationLog
  ) {
    let planes: Array<any> = JSON.parse(JSON.stringify(result));
    if (planes.length > 0) {
      let name = planes[0]['Name'] || '';
      await this.log(
        creation,
        'Paquete Emision Documento Soporte',
        true,
        `La empresa ya cuenta con un paquete de Emisión: ${name}`,
        true
      );
    } else {
      await this.BuscarTarifaDS(operatorvirtual)
        .then(async (tarifa) => {
          let tarifas: Tarifas[] = JSON.parse(JSON.stringify(tarifa));
          let tarifa_elegir = tarifas[0];
          await this.createPaqueteDS(
            operatorvirtual,
            creation.IdCompany_QA,
            tarifa_elegir?.Id || ''
          )
            .then(async (datareceive) => {
              await this.activarPaqueteDS(creation.IdCompany_QA, operatorvirtualId);
              await this.log(
                creation,
                'Paquete Emision Documento Soporte',
                true,
                `Se creó paquete de Emisión: ${String(datareceive)}`,
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
        })
        .catch(async (err) => {
          await this.log(
            creation,
            'Paquete Emision Documento Soporte',
            false,
            `Error al crear paquete de Emisión, no se encontró una tarifa: ${JSON.stringify(
              err
            )}`,
            true
          );
        });
    }
  }

  async awaitPaqueteN(
    operatorvirtual: string,
    operatorvirtualId : string,
    result: any,
    creation: CompanyCreationLog
  ) {
    let planes: Array<any> = JSON.parse(JSON.stringify(result));
    if (planes.length > 0) {
      let name = planes[0]['Name'] || '';
      await this.log(
        creation,
        'Paquete Emision Nomina Electrónica',
        true,
        `La empresa ya cuenta con un paquete de Emisión: ${name}`,
        true
      );
    } else {
      await this.createPaqueteN(operatorvirtual, creation.IdCompany_QA)
        .then(async (datareceive) => {
          await this.activarPaqueteN(creation.IdCompany_QA, operatorvirtualId);
          await this.log(
            creation,
            'Paquete Emision Nomina Electrónica',
            true,
            `Se creó paquete de Emisión: ${String(datareceive)}`,
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
  }

  //Crea paquetes emision Factura y/o Nomina
  async CrearPaqueteEmision(
    companyU: CompanyR_UC,
    operatorvirtual: string,
    operatorvirtualId: string
  ) {
    var creation: CompanyCreationLog =
      this.CompaniesCreated_Log.find!(
        (x) => x.Company_Utilities.id === companyU.id
      ) || new CompanyCreationLog();

    if (creation.IdCompany_QA != '') {
      //Paquetes facturación
      if (companyU.dataCreations[0].salesinvoice_included == false) {
        await this.log(
          creation,
          'Paquete Emision Facturación Electrónica',
          true,
          'No se creó paquete de Emisión, dado que el usuario no seleccionó servicio de Facturación Electrónica.',
          false
        );
      } else {
        if (creation.IdCompany_QA != '') {
          await this.searchPaqueteE(operatorvirtualId, creation.IdCompany_QA)
            .then(async (result) => {
              await this.awaitPaqueteE(companyU, operatorvirtualId, result, creation);
            })
            .catch(async (err) => {
              await this.log(
                creation,
                'Paquete Emision Facturación Electrónica',
                false,
                `Error al consultar e intentar crear paquete de Emisión: ${JSON.stringify(
                  err
                )}`,
                true
              );
            });
        }
      }

      //Paquetes Documento Soporte
      if (companyU.dataCreations[0].salesinvoice_included == false) {
        await this.log(
          creation,
          'Paquete Emision Documento Soporte',
          true,
          'No se creó paquete de Emisión, dado que el usuario no seleccionó servicio de Facturación Electrónica.',
          false
        );
      } else {
        if (creation.IdCompany_QA != '') {
          await this.searchPaqueteDS(operatorvirtual, operatorvirtualId, creation.IdCompany_QA)
            .then(async (result) => {
              await this.awaitPaqueteDS(operatorvirtual, operatorvirtualId, result, creation);
            })
            .catch(async (err) => {
              await this.log(
                creation,
                'Paquete Emision Documento Soporte',
                false,
                `Error al consultar e intentar crear paquete de Emisión: ${JSON.stringify(
                  err
                )}`,
                true
              );
            });
        }
      }

      //Paquetes nómina electrónica
      if (companyU.dataCreations[0].payrroll_included == false) {
        await this.log(
          creation,
          'Paquete Emision Nomina Electrónica',
          false,
          'No se creó paquete de Nómina electrónica, dado que el usuario no seleccionó el servicio.',
          false
        );
      } else {
        await this.searchPaqueteN(
          operatorvirtual,
          operatorvirtualId,
          creation.IdCompany_QA
        )
          .then(async (result) => {
            await this.awaitPaqueteN(operatorvirtual, operatorvirtualId, result, creation);
          })
          .catch(async (err) => {
            await this.log(
              creation,
              'Paquete Emision Nomina Electrónica',
              false,
              `Error al consultar e intentar crear paquete de Emisión: ${JSON.stringify(
                err
              )}`,
              true
            );
          });
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
        obj.Messages_QA.push(newLog);
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

  createPaqueteE_QA(
    operatorvirtualId: string,
    companyId: string,
    tarifaId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .ActivatePaqueteEmision_QA(operatorvirtualId, companyId, tarifaId)
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

  createPlanE_QA(operatorvirtualId: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .ActivatePlanEmision_QA(operatorvirtualId, companyId, tarifaId)
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

  createPaqueteDS_QA(
    operatorvirtual: string,
    companyId: string,
    tarifaId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .ActivatePaqueteEmisionDS_QA(operatorvirtual, companyId, tarifaId)
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

  createPlanDS_QA(operatorvirtual: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .ActivatePlanEmisionDS_QA(operatorvirtual, companyId, tarifaId)
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

  createPaqueteN_QA(operatorvirtual: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .CreatePaqueteNomina_QA(operatorvirtual, companyId, tarifaId)
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

  createPlanN_QA(operatorvirtual: string, companyId: string, tarifaId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .CreatePlanNomina_QA(operatorvirtual, companyId, tarifaId)
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
}
