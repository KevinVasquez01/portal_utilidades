import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  PackageModel,
  PlanModel,
  PlanPackage_Companies_Log,
} from 'src/app/models/PackagesPRD/massiveplanspackages';
import { Packages, Packages_Items } from 'src/app/models/PackagesPRD/packages';
import {
  PostPaidPackages,
  PrePaidPackages,
} from 'src/app/models/PackagesPRD/tarifas';
import { ActivarPaquetesPRDService } from 'src/app/services/SaphetyApi_PRD/activar-paquetes-prd.service';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { ActivarPaquetesService } from 'src/app/services/SaphetyApi_QA/activar-paquetes.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { CompaniesToAuthorizePackagesComponent } from '../../admin-companies/companies-to-authorize/companies-to-authorize-packages/companies-to-authorize-packages.component';

interface show {
  Index: number;
  Nombre: string;
  Documento: string;
  PlanFE: string;
  PlanDS: string;
  PlanNE: string;
  PlanRFE: string;
}

@Component({
  selector: 'app-massive-plans-packages-select',
  templateUrl: './massive-plans-packages-select.component.html',
  styleUrls: ['./massive-plans-packages-select.component.scss'],
})
export class MassivePlansPackagesSelectComponent implements AfterViewInit, OnInit {
  @Input() data: PlanPackage_Companies_Log[] = [];

  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<show> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() companiesResults: EventEmitter<PlanPackage_Companies_Log[]> =
    new EventEmitter();

  tarifas: Packages = { create: false, FE: [], DS: [], NE: [], DE: [] }; //Almacena tarifas
  tarifas_to_create: Packages = { create: false, FE: [], DS: [], NE: [], DE: [] }; //Almacena tarifas para crear

  ambiente = '';
  cargandoPaquetes: boolean = false;
  enviandoPaquetes: boolean = false;

  constructor(
    breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _planpackagePRD: ActivarPaquetesPRDService,
    private _planpackageQA: ActivarPaquetesService
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';

    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['Empresa', 'Actions']
        : ['Empresa', 'PlanFE', 'PlanDS', 'PlanNE', 'PlanRFE', 'Actions'];
    });
  }

  ngOnInit(): void {
    this.armarData();
  }

  armarData() {
    this.dataSource.data = [];
    let toShowData: Array<show> = [];

    function existPlanPaquete(
      planes: PlanModel[] | undefined,
      paquetes: PackageModel[] | undefined
    ) {
      let textplan = '';
      if (planes != undefined) {
        planes.forEach((element) => {
          textplan += textplan.length > 0 ? '; ' + element.Name : element.Name;
        });
      }

      if (paquetes != undefined) {
        paquetes.forEach((element) => {
          textplan += textplan.length > 0 ? '; ' + element.Name : element.Name;
        });
      }
      return textplan;
    }

    let index = 0;
    this.data.forEach((element) => {
      let companyName =
        element.company_saphety?.Name != ''
          ? element.company_saphety?.Name
          : `${element.company_saphety?.Person.FirstName} ${element.company_saphety?.Person.FamilyName}`;
      let companyDocument =
        element.company_saphety?.Identification.DocumentNumber +
        (element.company_saphety?.Identification.CheckDigit != undefined
          ? '-' + element.company_saphety?.Identification.CheckDigit
          : '');

      let toShow: show = {
        Index: index,
        Nombre: companyName != undefined ? companyName : '',
        Documento: companyDocument,
        PlanFE: existPlanPaquete(
          element.planpackages?.PlanesFE,
          element.planpackages?.PaquetesFE
        ),
        PlanDS: existPlanPaquete(
          element.planpackages?.PlanesDS,
          element.planpackages?.PaquetesDS
        ),
        PlanNE: existPlanPaquete(
          element.planpackages?.PlanesNE,
          element.planpackages?.PaquetesNE
        ),
        PlanRFE: existPlanPaquete(
          element.planpackages?.PlanesRE,
          element.planpackages?.PaquetesRE
        ),
      };
      toShowData.push(toShow);
      index++;
    });
    this.dataSource.data = toShowData;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  RemoveItem(element: show) {
    this.data = this.data.filter((x) => x != this.data[element.Index]);
    this.armarData();

    //Cierra
    if (this.data.length === 0) {
      this.closeAction();
    }
  }

  closeAction() {
    this.close.emit(true);
  }

  async selectTarifa() {
    this.cargandoPaquetes = true;
    if (
      this.tarifas.FE.length === 0 &&
      this.tarifas.DS.length === 0 &&
      this.tarifas.NE.length === 0
    ) {
      await this.BuscarTarifas();
    }

    const dialogRef = this.dialog.open(CompaniesToAuthorizePackagesComponent, {
      data: this.tarifas,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) {
        this.tarifas_to_create = { create: false, FE: [], DS: [], NE: [], DE: [] };
        this.tarifas.create = false;
      } else {
        this.tarifas_to_create = JSON.parse(JSON.stringify(result));
        if (
          this.tarifas_to_create.FE.length != 0 ||
          this.tarifas_to_create.DS.length != 0 ||
          this.tarifas_to_create.NE.length != 0
        ) {
          this.tarifas_to_create.create = true;
        } else {
          this.tarifas_to_create.create = false;
        }
      }

      this.cargandoPaquetes = false;
      console.log(this.tarifas_to_create);
    });
  }

  async BuscarTarifas() {
    this.tarifas.FE = [];
    this.tarifas.DS = [];
    this.tarifas.NE = [];

    let VirtualOperatorAlias: string =
      this.data.length > 0
        ? this.data[0].company_excel.Alias_Operador_Virtual
        : 'saphety';
    let VirtualOperatorId: string =
      this.data.length > 0
        ? this.data[0].company_saphety?.VirtualOperatorId + ''
        : '';

    let tarifas = this.tarifas;
    //Busca tarifas de FE en el operador virtual seleccionado en PRD
    await this.BuscarTarifasFE(VirtualOperatorId).then(
      (result) => (tarifas = result)
    );

    //Busca tarifas de DS en el operador virtual seleccionado en PRD
    await this.BuscarTarifasDS(VirtualOperatorAlias).then(
      (result) => (tarifas = result)
    );

    //Busca tarifas de NE en el operador virtual seleccionado en PRD
    await this.BuscarTarifasNE(VirtualOperatorAlias).then(
      (result) => (tarifas = result)
    );

    this.tarifas = tarifas;
  }

  //Obtiene tarifas prepago FE
  GetTarifaPrepaid_FE(VirtualOperatorId: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'QA') {
        this._getGetDataQA.FindTarifaPrePaid_FE(VirtualOperatorId).subscribe(
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
      } else {
        this._getGetDataPRD.FindTarifaPrePaid_FE(VirtualOperatorId).subscribe(
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
      }
    });
  }
  //Obtiene tarifas pospago FE
  GetTarifaPostPaid_FE(VirtualOperatorId: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'QA') {
        this._getGetDataQA.FindTarifaPostPaid_FE(VirtualOperatorId).subscribe(
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
      } else {
        this._getGetDataPRD.FindTarifaPostPaid_FE(VirtualOperatorId).subscribe(
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
      }
    });
  }

  //Obtiene tarifas prepago DS
  GetTarifaPrepaid_DS(VirtualOperatorAlias: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'QA') {
        this._getGetDataQA.FindTarifaPrePaid_DS(VirtualOperatorAlias).subscribe(
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
      } else {
        this._getGetDataPRD
          .FindTarifaPrePaid_DS(VirtualOperatorAlias)
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
      }
    });
  }
  //Obtiene tarifas pospago DS
  GetTarifaPostPaid_DS(VirtualOperatorAlias: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'QA') {
        this._getGetDataQA
          .FindTarifaPostPaid_DS(VirtualOperatorAlias)
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
      } else {
        this._getGetDataPRD
          .FindTarifaPostPaid_DS(VirtualOperatorAlias)
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
      }
    });
  }

  //Obtiene tarifas prepago NE
  GetTarifaPrepaid_NE(VirtualOperatorAlias: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'QA') {
        this._getGetDataQA.FindTarifaPrePaid_NE(VirtualOperatorAlias).subscribe(
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
      } else {
        this._getGetDataPRD
          .FindTarifaPrePaid_NE(VirtualOperatorAlias)
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
      }
    });
  }
  //Obtiene tarifas pospago NE
  GetTarifaPostPaid_NE(VirtualOperatorAlias: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'QA') {
        this._getGetDataQA
          .FindTarifaPostPaid_NE(VirtualOperatorAlias)
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
      } else {
        this._getGetDataPRD
          .FindTarifaPostPaid_NE(VirtualOperatorAlias)
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
      }
    });
  }

  async BuscarTarifasFE(VirtualOperatorId: string) {
    let tarifas: Packages = this.tarifas;
    //Busca tarifas pospago para Factura electrónica
    await this.GetTarifaPostPaid_FE(VirtualOperatorId).then((result) => {
      let tarif: Array<PostPaidPackages> = JSON.parse(JSON.stringify(result));
      tarif.forEach((x) => {
        if (x.IsEnabled) {
          tarifas.FE.push({
            Id: x.Id,
            Name: x.Name,
            Description: x.Description,
            Price: x.MinimumPrice,
            PlanType: x.PlanType,
            IsEnabled: x.IsEnabled,
            Type: 'Postpaid',
          });
        }
      });
    });
    //Busca tarifas prepago para Factura electrónica
    await this.GetTarifaPrepaid_FE(VirtualOperatorId).then((result) => {
      let tarif: Array<PrePaidPackages> = JSON.parse(JSON.stringify(result));
      tarif.forEach((x) => {
        if (x.IsEnabled) {
          tarifas.FE.push({
            Id: x.Id,
            Name: x.Name,
            Description: x.Description,
            Price: x.Price,
            PlanType: '',
            IsEnabled: x.IsEnabled,
            Type: 'Prepaid',
          });
        }
      });
    });

    return tarifas;
  }

  async BuscarTarifasDS(VirtualOperatorAlias: string) {
    let tarifas: Packages = this.tarifas;
    //Busca tarifas pospago para Documento Soporte
    await this.GetTarifaPostPaid_DS(VirtualOperatorAlias).then((result) => {
      let tarif: Array<PostPaidPackages> = JSON.parse(JSON.stringify(result));
      tarif.forEach((x) => {
        if (x.IsEnabled) {
          tarifas.DS.push({
            Id: x.Id,
            Name: x.Name,
            Description: x.Description,
            Price: x.MinimumPrice,
            PlanType: x.PlanType,
            IsEnabled: x.IsEnabled,
            Type: 'Postpaid',
          });
        }
      });
    });
    //Busca tarifas prepago para Documento Soporte
    await this.GetTarifaPrepaid_DS(VirtualOperatorAlias).then((result) => {
      let tarif: Array<PrePaidPackages> = JSON.parse(JSON.stringify(result));
      tarif.forEach((x) => {
        if (x.IsEnabled) {
          tarifas.DS.push({
            Id: x.Id,
            Name: x.Name,
            Description: x.Description,
            Price: x.Price,
            PlanType: '',
            IsEnabled: x.IsEnabled,
            Type: 'Prepaid',
          });
        }
      });
    });

    return tarifas;
  }

  async BuscarTarifasNE(VirtualOperatorAlias: string) {
    let tarifas: Packages = this.tarifas;
    //Busca tarifas pospago para Nómina electrónica
    await this.GetTarifaPostPaid_NE(VirtualOperatorAlias).then((result) => {
      let tarif: Array<PostPaidPackages> = JSON.parse(JSON.stringify(result));
      tarif.forEach((x) => {
        if (x.IsEnabled) {
          tarifas.NE.push({
            Id: x.Id,
            Name: x.Name,
            Description: x.Description,
            Price: x.MinimumPrice,
            PlanType: x.PlanType,
            IsEnabled: x.IsEnabled,
            Type: 'Postpaid',
          });
        }
      });
    });
    //Busca tarifas prepago para Nómina electrónica
    await this.GetTarifaPrepaid_NE(VirtualOperatorAlias).then((result) => {
      let tarif: Array<PrePaidPackages> = JSON.parse(JSON.stringify(result));
      tarif.forEach((x) => {
        if (x.IsEnabled) {
          tarifas.NE.push({
            Id: x.Id,
            Name: x.Name,
            Description: x.Description,
            Price: x.Price,
            PlanType: '',
            IsEnabled: x.IsEnabled,
            Type: 'Prepaid',
          });
        }
      });
    });

    return tarifas;
  }

  async SendPlanesyPaquetes() {
    this.enviandoPaquetes = true;
    for (let i = 0; i < this.data.length; i++) {
      await this.CrearPaqueteEmision(this.data[i]);
    }

    this.enviandoPaquetes = false;
    this.companiesResults.emit(this.data);
  }

  async awaitPaqueteE(
    company: PlanPackage_Companies_Log,
    tarifa: Packages_Items
  ) {
    if (this.ambiente == 'QA') {
      await this._planpackageQA
        .createPaqueteE_QA(
          company.company_saphety?.VirtualOperatorId + '',
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Facturación Electrónica',
            message: `Se creó paquete de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Facturación Electrónica',
            message: `Error al crear paquete de Emisión: ${JSON.stringify(
              err
            )}`,
            status: false,
          });
        });
    } else {
      await this._planpackagePRD
        .createPaqueteE(
          company.company_saphety?.VirtualOperatorId + '',
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Facturación Electrónica',
            message: `Se creó paquete de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Facturación Electrónica',
            message: `Error al crear paquete de Emisión: ${JSON.stringify(
              err
            )}`,
            status: false,
          });
        });
    }
  }

  async awaitPlanE(company: PlanPackage_Companies_Log, tarifa: Packages_Items) {
    if (this.ambiente == 'QA') {
      await this._planpackageQA
        .createPlanE_QA(
          company.company_saphety?.VirtualOperatorId + '',
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Facturación Electrónica',
            message: `Se creó plan de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Facturación Electrónica',
            message: `Error al crear plan de Emisión: ${JSON.stringify(err)}`,
            status: false,
          });
        });
    } else {
      await this._planpackagePRD
        .createPlanE(
          company.company_saphety?.VirtualOperatorId + '',
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Facturación Electrónica',
            message: `Se creó plan de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Facturación Electrónica',
            message: `Error al crear plan de Emisión: ${JSON.stringify(err)}`,
            status: false,
          });
        });
    }
  }

  async awaitPaqueteDS(
    company: PlanPackage_Companies_Log,
    tarifa: Packages_Items
  ) {
    if (this.ambiente == 'QA') {
      await this._planpackageQA
        .createPaqueteDS_QA(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Documento Soporte',
            message: `Se creó paquete de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Documento Soporte',
            message: `Error al crear paquete de Emisión: ${JSON.stringify(
              err
            )}`,
            status: false,
          });
        });
    } else {
      await this._planpackagePRD
        .createPaqueteDS(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Documento Soporte',
            message: `Se creó paquete de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Documento Soporte',
            message: `Error al crear paquete de Emisión: ${JSON.stringify(
              err
            )}`,
            status: false,
          });
        });
    }
  }

  async awaitPlanDS(
    company: PlanPackage_Companies_Log,
    tarifa: Packages_Items
  ) {
    if (this.ambiente == 'QA') {
      await this._planpackageQA
        .createPlanDS_QA(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Documento Soporte',
            message: `Se creó plan de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Documento Soporte',
            message: `Error al crear plan de Emisión: ${JSON.stringify(err)}`,
            status: false,
          });
        });
    } else {
      await this._planpackagePRD
        .createPlanDS(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Documento Soporte',
            message: `Se creó plan de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Documento Soporte',
            message: `Error al crear plan de Emisión: ${JSON.stringify(err)}`,
            status: false,
          });
        });
    }
  }

  async awaitPaqueteN(
    company: PlanPackage_Companies_Log,
    tarifa: Packages_Items
  ) {
    if (this.ambiente == 'QA') {
      await this._planpackageQA
        .createPaqueteN_QA(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Nomina Electrónica',
            message: `Se creó paquete de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Nomina Electrónica',
            message: `Error al crear paquete de Emisión: ${JSON.stringify(
              err
            )}`,
            status: false,
          });
        });
    } else {
      await this._planpackagePRD
        .createPaqueteN(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Nomina Electrónica',
            message: `Se creó paquete de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Paquete Emision Nomina Electrónica',
            message: `Error al crear paquete de Emisión: ${JSON.stringify(
              err
            )}`,
            status: false,
          });
        });
    }
  }

  async awaitPlanN(company: PlanPackage_Companies_Log, tarifa: Packages_Items) {
    if (this.ambiente == 'QA') {
      await this._planpackageQA
        .createPlanN_QA(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Nomina Electrónica',
            message: `Se creó Plan de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Nomina Electrónica',
            message: `Error al crear Plan de Emisión: ${JSON.stringify(err)}`,
            status: false,
          });
        });
    } else {
      await this._planpackagePRD
        .createPlanN(
          company.company_excel.Alias_Operador_Virtual,
          company.company_saphety?.Id + '',
          tarifa.Id
        )
        .then(async () => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Nomina Electrónica',
            message: `Se creó Plan de Emisión: ${tarifa.Name}`,
            status: true,
          });
        })
        .catch(async (err) => {
          company.log.push({
            date: new Date(),
            module: 'Plan Emision Nomina Electrónica',
            message: `Error al crear Plan de Emisión: ${JSON.stringify(err)}`,
            status: false,
          });
        });
    }
  }

  async CrearPaqueteEmision(company: PlanPackage_Companies_Log) {
    //Paquetes facturación y recepción
    if (this.tarifas_to_create.FE.length > 0) {
      for (let i = 0; i < this.tarifas_to_create.FE.length; i++) {
        if (this.tarifas_to_create.FE[i].Type == 'Postpaid') {
          await this.awaitPlanE(company, this.tarifas_to_create.FE[i]);
        } else if (this.tarifas_to_create.FE[i].Type == 'Prepaid') {
          await this.awaitPaqueteE(company, this.tarifas_to_create.FE[i]);
        }
      }
    }

    //Paquetes documento soporte
    if (this.tarifas_to_create.DS.length > 0) {
      for (let i = 0; i < this.tarifas_to_create.DS.length; i++) {
        if (this.tarifas_to_create.DS[i].Type == 'Postpaid') {
          await this.awaitPlanDS(company, this.tarifas_to_create.DS[i]);
        } else if (this.tarifas_to_create.DS[i].Type == 'Prepaid') {
          await this.awaitPaqueteDS(company, this.tarifas_to_create.DS[i]);
        }
      }
    }

    //Paquetes nómina electrónica
    if (this.tarifas_to_create.NE.length > 0) {
      for (let i = 0; i < this.tarifas_to_create.NE.length; i++) {
        if (this.tarifas_to_create.NE[i].Type == 'Postpaid') {
          await this.awaitPlanN(company, this.tarifas_to_create.NE[i]);
        } else if (this.tarifas_to_create.NE[i].Type == 'Prepaid') {
          await this.awaitPaqueteN(company, this.tarifas_to_create.NE[i]);
        }
      }
    }
  }
}
