import { Injectable } from '@angular/core';
import { Enablement_Companies_PlanOPaquete } from 'src/app/models/Enablement/Enablement';
import {
  PackageModel,
  PlanModel,
  PlanPackage_Companies,
} from 'src/app/models/PackagesPRD/massiveplanspackages';
import { APIGetServicePRD } from './apiget.service';

@Injectable({
  providedIn: 'root',
})
export class SearchPlanPaquetePRDService {
  constructor(private _getGetDataPRD: APIGetServicePRD) {}

  getPackageFV(virtualOperatorId: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD
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

  getPlanEmisionFV(virtualOperatorId: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD
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

  getPackageDS(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD
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

  getPlanEmisionDS(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD
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

  getPackageNE(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD
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

  getPlanEmisionNE(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD
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
      let paquete = await this.getPackageFV(virtualOperatorId, companyId);
      let plan = await this.getPlanEmisionFV(virtualOperatorId, companyId);
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
      let paquete = await this.getPackageDS(
        virtualOperatorAlias,
        virtualOperatorId,
        companyId
      );
      let plan = await this.getPlanEmisionDS(
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
      this._getGetDataPRD
        .ActivatePaqueteEmision(
          operatorvirtualId,
          companyId,
          tarifaId != undefined
            ? tarifaId
            : '738774f3-1b23-ea11-a2d4-005056959ac7'
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
        toReturn.createdPU = true;
        toReturn.id = JSON.parse(JSON.stringify(data));
        toReturn.name = 'Básico';
      })
      .catch(async (err) => {
        toReturn.createdPU = false;
        toReturn.id = '';
        toReturn.name = '';
        toReturn.error = JSON.stringify(err);
      });
    return toReturn;
  }

  eliminaPaqueteE(
    operatorvirtualId: string,
    companyId: string,
    packageId: string
  ) {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD
        .RemovePaqueteEmision(operatorvirtualId, companyId, packageId)
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

  async obtenerPlanyPaquete(
    virtualOperatorAlias: string,
    virtualOperatorId: string,
    companyId: string,
    all: boolean
  ) {
    let data = await Promise.all([
      //Paquete FV
      this.getPackageFV(virtualOperatorId, companyId),
      //Plan FV
      this.getPlanEmisionFV(virtualOperatorId, companyId),
      //Paquete DS
      this.getPackageDS(virtualOperatorAlias, virtualOperatorId, companyId),
      //Plan DS
      this.getPlanEmisionDS(virtualOperatorAlias, virtualOperatorId, companyId),
      //Paquete NE
      this.getPackageNE(virtualOperatorAlias, virtualOperatorId, companyId),
      //Plan NE
      this.getPlanEmisionNE(virtualOperatorAlias, virtualOperatorId, companyId),
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
