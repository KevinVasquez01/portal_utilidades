import { Injectable } from '@angular/core';
import { Enablement_Companies_PlanOPaquete } from 'src/app/models/Enablement/Enablement';
import {
  PackageModel,
  PlanModel,
  PlanPackage_Companies,
} from 'src/app/models/PackagesPRD/massiveplanspackages';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { APIGetServiceQA } from './apiget.service';

@Injectable({
  providedIn: 'root',
})
export class SearchPlanPaqueteServiceQA {
  constructor(private _getGetDataQA: APIGetServiceQA) {}

  getPackageFVQA(virtualOperatorId: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPaqueteEmision(virtualOperatorId, companyId)
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

  getPlanEmisionFVQA(virtualOperatorId: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPlanEmision(virtualOperatorId, companyId)
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

  getPackageDSQA(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPaqueteEmisionDS(
          virtualOperatorAlias,
          virtualOperatorId,
          companyId
        )
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

  getPlanEmisionDSQA(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPlanEmisionDS(virtualOperatorAlias, virtualOperatorId, companyId)
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

  getPackageNEQA(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPaqueteEmisionNE(
          virtualOperatorAlias,
          virtualOperatorId,
          companyId
        )
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

  getPlanEmisionNEQA(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .SearchPlanEmisionNE(virtualOperatorAlias, virtualOperatorId, companyId)
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

  async searchPlanorPackageFV(virtualOperatorId: string, companyId: string) {
    try {
      GlobalConstants.tokenUserQA = localStorage.getItem('token') || '';
      let paquete = await this.getPackageFVQA(virtualOperatorId, companyId);
      let plan = await this.getPlanEmisionFVQA(virtualOperatorId, companyId);
      let result: Array<any> = JSON.parse(JSON.stringify(paquete));
      if (result.length > 0) {
        return result;
      }

      result = JSON.parse(JSON.stringify(plan));
      if (result.length > 0) {
        return result;
      }
    } catch {
      return [];
    }
  }

  async searchPlanorPackageDS(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    try {
      let paquete = await this.getPackageDSQA(
        virtualOperatorAlias,
        virtualOperatorId,
        companyId
      );
      let plan = await this.getPlanEmisionDSQA(
        virtualOperatorAlias,
        virtualOperatorId,
        companyId
      );

      let result: Array<any> = JSON.parse(JSON.stringify(paquete));
      if (result.length > 0) {
        return result;
      }

      result = JSON.parse(JSON.stringify(plan));
      if (result.length > 0) {
        return result;
      }
    } catch {
      return [];
    }
  }

  createPaqueteE(
    operatorvirtualId: string,
    companyId: string,
    tarifaId?: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA
        .ActivatePaqueteEmision(
          operatorvirtualId,
          companyId,
          tarifaId != undefined
            ? tarifaId
            : '1b4e8783-2d4b-ed11-a2d6-00505695a8eb'
        )
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
    companyId: string,
    tarifaId?: string
  ) {
    let toReturn: Enablement_Companies_PlanOPaquete = {
      createdPU: false,
      id: '',
      name: '',
    };
    await this.createPaqueteE(operatorvirtualId, companyId, tarifaId)
      .then(async (data) => {
        let result: Array<any> = JSON.parse(JSON.stringify(data));
        toReturn.createdPU = true;
        toReturn.id = result[0]?.['Id'] || '';
        toReturn.name = result[0]?.['Name'] || '';
      })
      .catch(async (err) => {
        toReturn.createdPU = false;
        toReturn.id = '';
        toReturn.name = '';
        toReturn.error = JSON.stringify(err);
      });
    return toReturn;
  }

  async obtenerPlanyPaquete(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string,
    all: boolean
  ) {
    let data = await Promise.all([
      //Paquete FV
      this.getPackageFVQA(virtualOperatorId, companyId),
      //Plan FV
      this.getPlanEmisionFVQA(virtualOperatorId, companyId),
      //Paquete DS
      this.getPackageDSQA(virtualOperatorAlias, virtualOperatorId, companyId),
      //Plan DS
      this.getPlanEmisionDSQA(
        virtualOperatorAlias,
        virtualOperatorId,
        companyId
      ),
      //Paquete NE
      this.getPackageNEQA(virtualOperatorAlias, virtualOperatorId, companyId),
      //Plan NE
      this.getPlanEmisionNEQA(
        virtualOperatorAlias,
        virtualOperatorId,
        companyId
      ),
    ]).catch(() => {});
    let [PaquetesFE, PlanesFE, PaquetesDS, PlanesDS, PaquetesNE, PlanesNE]: [
      Array<PackageModel>,
      Array<PlanModel>,
      Array<PackageModel>,
      Array<PlanModel>,
      Array<PackageModel>,
      Array<PlanModel>
    ] = JSON.parse(JSON.stringify(data));

    let [PaquetesRE, PlanesRE]: [Array<PackageModel>, Array<PlanModel>] = [
      PaquetesFE.filter((x) => x.PlanType === 'Inbound'),
      PlanesFE,
    ];
    PaquetesFE = PaquetesFE.filter((x) => x.PlanType === 'Outbound');

    //Retorna solo planes y paquetes activos
    if (!all) {
      function PDate(date: string | null) {
        try {
          if(date != null){
            return new Date(date).getTime();
          }
          else{
            return new Date().getTime();
          }
        } catch {
          return new Date().getTime();
        }
      }

      let datenumber = new Date().getTime();
      PaquetesFE = PaquetesFE.filter(
        (x) => PDate(x.ExpirationDate) >= datenumber
      );
      PlanesFE = PlanesFE.filter((x) => PDate(x.ExpirationDate) >= datenumber);
      PaquetesDS = PaquetesDS.filter(
        (x) => PDate(x.ExpirationDate) >= datenumber
      );
      PlanesDS = PlanesDS.filter((x) => PDate(x.ExpirationDate) >= datenumber);
      PaquetesNE = PaquetesNE.filter(
        (x) => PDate(x.ExpirationDate) >= datenumber
      );
      PlanesNE = PlanesNE.filter((x) => PDate(x.ExpirationDate) >= datenumber);
      PaquetesRE = PaquetesRE.filter(
        (x) => PDate(x.ExpirationDate) >= datenumber
      );
      PlanesRE = PlanesRE.filter((x) => PDate(x.ExpirationDate) >= datenumber);
    }

    let planesypaquetes: PlanPackage_Companies = {
      PaquetesFE: PaquetesFE,
      PlanesFE: PlanesFE,
      PaquetesDS: PaquetesDS,
      PlanesDS: PlanesDS,
      PaquetesNE: PaquetesNE,
      PlanesNE: PlanesNE,
      PaquetesRE: PaquetesRE,
      PlanesRE: PlanesRE,
    };

    return planesypaquetes;
  }
}
