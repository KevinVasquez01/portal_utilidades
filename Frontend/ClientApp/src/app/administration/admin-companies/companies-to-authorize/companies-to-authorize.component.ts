import { AfterViewInit, Component, EventEmitter, HostBinding, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { ResponseI } from 'src/app/models/response.interface';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { AuthService } from 'src/app/services/auth.service';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { SerieEmisionService } from 'src/app/services/SaphetyApi_QA/serie-emision.service';
import { SerieHDianService } from 'src/app/services/SaphetyApi_QA/serie-habilitacion-dian.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CompanyDialogComponent } from '../../company-dialog/company-dialog.component';
import { ActivarPaquetesService } from 'src/app/services/SaphetyApi_QA/activar-paquetes.service';
import { GetCompaniesQAService } from 'src/app/services/SaphetyApi_QA/get-companies-qa.service';
import { SendTransactionsService } from 'src/app/services/UtilidadesAPI/send-transactions.service';
import { LoginI } from 'src/app/models/login.interface';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { CompanyCreationLog } from 'src/app/models/Company-utilities/company-creation-log';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { CrearUsuariosService } from 'src/app/services/SaphetyApi_QA/crear-usuarios.service';
import { CrearCompanyService } from 'src/app/services/SaphetyApi_QA/crear-company.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { CrearUsuariosPRDService } from 'src/app/services/SaphetyApi_PRD/crear-usuarios-prd.service';
import { CrearCompanyPRDService } from 'src/app/services/SaphetyApi_PRD/crear-company-prd.service';
import { SerieHDianPRDService } from 'src/app/services/SaphetyApi_PRD/serie-habilitacion-dian-prd.service.service';
import { ActivarPaquetesPRDService } from 'src/app/services/SaphetyApi_PRD/activar-paquetes-prd.service';
import { Packages } from 'src/app/models/PackagesPRD/packages';
import { PostPaidPackages, PrePaidPackages } from 'src/app/models/PackagesPRD/tarifas';
import { CompaniesToAuthorizePackagesComponent } from './companies-to-authorize-packages/companies-to-authorize-packages.component';
import { Voperator } from 'src/app/models/vo';
import { NotificationsService } from 'src/app/services/UtilidadesAPI/notifications.service';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';

@Component({
  selector: 'app-companies-to-authorize',
  templateUrl: './companies-to-authorize.component.html',
  styleUrls: ['./companies-to-authorize.component.css']
})
export class CompaniesToAuthorizeComponent implements AfterViewInit, OnInit {
  //Almacena compañías pendientes
  @HostBinding('class.is-open') CompaniesPending: CompanyR_UC[] = [];
  //Almacena compañías por autorizar
  @HostBinding('class.is-open') CompaniestoAuth: CompanyR_UC[] = [];
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];

  opvs: Voperator[] = [];
  opvSelected: Voperator = { Id: '', Alias: '', Name: '' };
  selected_opv = this.opvs;
  selected_opvalue = ''; //alias virtual operator
  selected_opvalueId = ''; //id virtual operator
  ambiente: any;

  cargandoPaquetes = false; //almacena cuando se están consultando paquetes de PRD
  creandoCompanies = false; //almacena cuando se están creando companies

  tarifasPRD: Packages = { create: false, FE: [], DS: [], NE: [], DE: [] }; //Almacena tarifas para PRD
  tarifas_to_create: Packages = { create: false, FE: [], DS: [], NE: [], DE: [] }; //Almacena tarifas para crear en PRD

  displayedColumns = ['services', 'distributorId', 'documentType', 'documentNumber', 'name', 'actions'];
  dataSource = new MatTableDataSource<CompanyR_UC>(this.CompaniestoAuth);

  @Output() datasaliente: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  mostrar = false;

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];

  constructor(
    private dialog: MatDialog,
    private _crearUsuariosService: CrearUsuariosService,
    private _crearUsuariosPRDService: CrearUsuariosPRDService,
    private _seriesHDianService: SerieHDianService,
    private _seriesHDianPRDService: SerieHDianPRDService,
    private _seriesEmision: SerieEmisionService,
    private _paquetesService: ActivarPaquetesService,
    private _paquetesPRDService: ActivarPaquetesPRDService,
    private _companiesQAService: GetCompaniesQAService,
    private _transactionUService: SendTransactionsService,
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _auth: AuthService,
    private _toastProvider: ToastProvider,
    private _dialog: MatDialog,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _CrearCompanyService: CrearCompanyService,
    private _CrearCompanyPRDService: CrearCompanyPRDService,
    private _dataElementsU: DataElementsService,
    private _NotificationsService: NotificationsService
    ) {
      let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '' ;
    this.awaitVirtualOperators();
  }

  async changeplanopaquete(event: boolean) {
    this.tarifasPRD.create = event;
    if (event) {
      this.cargandoPaquetes = true;
      await this.BuscarTarifas()
        .finally(() => {
          const dialogRef = this.dialog.open(CompaniesToAuthorizePackagesComponent, {
            data: this.tarifasPRD
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
              this.tarifas_to_create = { create: false, FE: [], DS: [], NE: [], DE: [] };
              this.tarifasPRD.create = false;
            }
            else {
              this.tarifas_to_create.create = true;
              this.tarifas_to_create = JSON.parse(JSON.stringify(result));
            }
          });
          this.cargandoPaquetes = false;
        });
    }
    else {
      this.tarifas_to_create = { create: false, FE: [], DS: [], NE: [], DE: [] };
      this.tarifasPRD = { create: false, FE: [], DS: [], NE: [], DE: [] };
    }
  }

  //Obtiene tarifas prepago FE
  GetTarifaPrepaid_FE() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPrePaid_FE(this.selected_opvalueId).subscribe(data => {
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
  //Obtiene tarifas pospago FE
  GetTarifaPostPaid_FE() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPostPaid_FE(this.selected_opvalueId).subscribe(data => {
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

   //Obtiene tarifas prepago DS
   GetTarifaPrepaid_DS() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPrePaid_DS(this.selected_opvalue).subscribe(data => {
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
  //Obtiene tarifas pospago DS
  GetTarifaPostPaid_DS() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPostPaid_DS(this.selected_opvalue).subscribe(data => {
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

  //Obtiene tarifas prepago NE
  GetTarifaPrepaid_NE() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPrePaid_NE(this.selected_opvalue).subscribe(data => {
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
  //Obtiene tarifas pospago NE
  GetTarifaPostPaid_NE() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPostPaid_NE(this.selected_opvalue).subscribe(data => {
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

   //Obtiene tarifas prepago DE
   GetTarifaPrepaid_DE() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPrePaid_DE(this.selected_opvalue).subscribe(data => {
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
  //Obtiene tarifas pospago DE
  GetTarifaPostPaid_DE() {
    return new Promise((resolve, reject) => {
      this._getGetDataPRD.FindTarifaPostPaid_DE(this.selected_opvalue).subscribe(data => {
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

  async BuscarTarifasFE() {
    let tarifas: Packages = this.tarifasPRD;
    //Busca tarifas pospago para Factura electrónica
    await this.GetTarifaPostPaid_FE()
      .then(result => {
        let tarif: Array<PostPaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.FE.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.MinimumPrice,
              PlanType: x.PlanType,
              IsEnabled: x.IsEnabled,
              Type: 'Postpaid'
            });
          }
        });
      });
    //Busca tarifas prepago para Factura electrónica
    await this.GetTarifaPrepaid_FE()
      .then(result => {
        let tarif: Array<PrePaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.FE.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.Price,
              PlanType: '',
              IsEnabled: x.IsEnabled,
              Type: 'Prepaid'
            });
          }
        });
      });

    return tarifas;
  }

  async BuscarTarifasDS() {
    let tarifas: Packages = this.tarifasPRD;
    //Busca tarifas pospago para Documento Soporte
    await this.GetTarifaPostPaid_DS()
      .then(result => {
        let tarif: Array<PostPaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.DS.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.MinimumPrice,
              PlanType: x.PlanType,
              IsEnabled: x.IsEnabled,
              Type: 'Postpaid'
            });
          }
        });
      });
    //Busca tarifas prepago para Documento Soporte
    await this.GetTarifaPrepaid_DS()
      .then(result => {
        let tarif: Array<PrePaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.DS.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.Price,
              PlanType: '',
              IsEnabled: x.IsEnabled,
              Type: 'Prepaid'
            });
          }
        });
      });

    return tarifas;
  }

  async BuscarTarifasNE(tarifas: Packages) {
    //Busca tarifas pospago para Nómina electrónica
    await this.GetTarifaPostPaid_NE()
      .then(result => {
        let tarif: Array<PostPaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.NE.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.MinimumPrice,
              PlanType: x.PlanType,
              IsEnabled: x.IsEnabled,
              Type: 'Postpaid'
            });
          }
        });
      });
    //Busca tarifas prepago para Nómina electrónica
    await this.GetTarifaPrepaid_NE()
      .then(result => {
        let tarif: Array<PrePaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.NE.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.Price,
              PlanType: '',
              IsEnabled: x.IsEnabled,
              Type: 'Prepaid'
            });
          }
        });
      });

    return tarifas;
  }

  async BuscarTarifasDE() {
    let tarifas: Packages = this.tarifasPRD;
    //Busca tarifas pospago para Documento Equivalente
    await this.GetTarifaPostPaid_DE()
      .then(result => {
        let tarif: Array<PostPaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.DE.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.MinimumPrice,
              PlanType: x.PlanType,
              IsEnabled: x.IsEnabled,
              Type: 'Postpaid'
            });
          }
        });
      });
    //Busca tarifas prepago para Documento Equivalente
    await this.GetTarifaPrepaid_DE()
      .then(result => {
        let tarif: Array<PrePaidPackages> = JSON.parse(JSON.stringify(result));
        tarif.forEach(x => {
          if (x.IsEnabled) {
            tarifas.DE.push({
              Id: x.Id,
              Name: x.Name,
              Description: x.Description,
              Price: x.Price,
              PlanType: '',
              IsEnabled: x.IsEnabled,
              Type: 'Prepaid'
            });
          }
        });
      });

    return tarifas;
  }

  async BuscarTarifas() {
    this.tarifasPRD.FE = [];
    this.tarifasPRD.NE = [];
    this.tarifasPRD.DE = [];
    if (this.ambiente == 'QA') {
      return;
    }

    let salesinvoiceIncluded = false, documentsuportIncluded = false, payrrollIncluded = false, receptionSalesinvoiceIncluded = false, equivalentDocumentIncluded = false;
    this.CompaniestoAuth.forEach(company => {
      if (company.dataCreations[0].salesinvoice_included) {
        salesinvoiceIncluded = true;
      }

      if (company.dataCreations[0].documentsuport_included) {
        documentsuportIncluded = true;
      }

      if (company.dataCreations[0].payrroll_included) {
        payrrollIncluded = true;
      }

      if (company.dataCreations[0].reception_salesinvoice_included) {
        receptionSalesinvoiceIncluded = true;
      }

      if (company.dataCreations[0].equivalentdocumentincluded) {
        equivalentDocumentIncluded = true;
      }
    })

    let tarifas = this.tarifasPRD;
    if (salesinvoiceIncluded || receptionSalesinvoiceIncluded) {
      //Busca tarifas de FE en el operador virtual seleccionado en PRD
      await this.BuscarTarifasFE()
        .then(result => tarifas = result);
    }

    if (documentsuportIncluded) {
      //Busca tarifas de DS en el operador virtual seleccionado en PRD
      await this.BuscarTarifasDS()
        .then(result => tarifas = result);
    }

    if (payrrollIncluded) {
      //Busca tarifas de NE en el operador virtual seleccionado en PRD
      await this.BuscarTarifasNE(tarifas)
        .then(result => tarifas = result);
    }

    if (equivalentDocumentIncluded) {
      //Busca tarifas de DE en el operador virtual seleccionado en PRD
      await this.BuscarTarifasDE()
        .then(result => tarifas = result);
    }
    this.tarifasPRD = tarifas;
  }

  sendCompanyCreations() {
    return new Promise((resolve) => {
      //Actualiza listado de Compañías
      let noCreadas: Array<CompanyR_UC> = [];
      this.CompaniestoAuth.forEach(company => {
        //Log de compañía actual
        var companyLog = this.CompaniesCreated_Log.find(x => x.Company_Utilities.id === company.id) || new CompanyCreationLog();
        if (companyLog.IdCompany_PRD != '' && companyLog.IdCompany_QA != '') {
          noCreadas.push(company);
        }
      });

      this.CompaniestoAuth = [];
      this._AuthorizeCS.changeCtoAuth(this.CompaniestoAuth);

      //Envía a listado de compañías pendientes
      noCreadas.forEach(x => this.CompaniesPending.push(x));
      this._AuthorizeCS.changePendingCompany(this.CompaniesPending);
      resolve(true);
    });
  }

  changeOperator(event: any) {
    var operatorselected = this.opvs.find(x => x.Alias == event);
    if (operatorselected != undefined) {
      this.selected_opvalueId = operatorselected!.Id;
      this.selected_opvalue = operatorselected!.Alias;
    }
  }

  defaultOperator() {
    var operatorselected = this.opvs.find(x => x.Alias == 'saphety');
    if (operatorselected != undefined) {
      this.opvSelected = operatorselected;
      this.changeOperator(operatorselected.Alias);
    }
  }

  cancelitem(event: any) {
    //Elimina item de compañías por autorizar
    let index = this.CompaniestoAuth.indexOf(event);
    this.CompaniestoAuth.splice(index, 1);
    this._AuthorizeCS.changeCtoAuth(this.CompaniestoAuth);

    //Envía a listado de compañías pendientes
    this.CompaniesPending.push(event);
    this._AuthorizeCS.changePendingCompany(this.CompaniesPending);
  }

  ngOnInit(): void {
    //Compañías pendientes
    this._AuthorizeCS.pendingCompanies_U.subscribe(companies => this.CompaniesPending = companies);
    //Log Compañías
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => this.CompaniesCreated_Log = logs);
    this._AuthorizeCS.authCompanies.subscribe(companies => {
      this.CompaniestoAuth = companies;
      this.dataSource.data = companies;
    });
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.GetDistributors();
  }

  //Obtiene distribuidores de UtilidadesAPI
  GetDistributors() {
    return new Promise((resolve, reject) => {
      this._dataElementsU.getDdataelementU('Distribuidores')
        .then((result) => {
          //Desde servicio Utilidades
          this.listdist = JSON.parse(result.json);
          resolve(true);
        })
        .catch(() => {
          this.listdist = [];
          reject();
        });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: any) {
    let filterValue = event?.target?.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Operadores virtuales
  onKey_opv(event: any) {
    this.selected_opv = this.search_opv(event.target.value);
  }

  search_opv(value: string) {
    let filter = value.toLowerCase();
    return this.opvs.filter((option: { Name: string; }) => option.Name.toLowerCase().startsWith(filter));
  }

  //Espera a que termine de obtener operadores virtuales
  async awaitVirtualOperators() {
    const toastProvider_Function = this._toastProvider;
    await this.getVirtualOperators()
      .finally(() => {
        this.defaultOperator();
      })
      .catch(result => {
        toastProvider_Function.dangerMessage(`Ocurrió un error al obtener los operadores virtuales ${JSON.stringify(result)}`);
      });
  }

  //Operadores
  getVirtualOperators() {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        let body: findvirtualoperatorI = { Id: '', SortField: '-CreationDate', Alias: '' };
        this._getGetDataPRD.GetVirtualOperators(body).subscribe(data => {
          let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
          if (dataRespomnsive?.IsValid) {
            let operadores: Voperator[] = JSON.parse(JSON.stringify(dataRespomnsive?.ResultData));
            //Agrego operadores a lista
            operadores.forEach(x => this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name }));
            resolve(operadores);
          }
          else {
            reject(data['ResultData']);
          }
        },
          error => {
            reject(error['ResultData']);
          });
      }
      else if (this.ambiente == 'QA') {
        let body: findvirtualoperatorI = { Id: '', SortField: '-CreationDate', Alias: '' };
        this._getGetDataQA.GetVirtualOperators(body).subscribe(data => {
          let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
          if (dataRespomnsive?.IsValid) {
            let operadores: Voperator[] = JSON.parse(JSON.stringify(dataRespomnsive?.ResultData));
            //Agrego operadores a lista
            operadores.forEach(x => this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name }));
            resolve(operadores);
          }
          else {
            reject(data['ResultData']);
          }
        },
          error => {
            reject(error['ResultData']);
          });
      }
    });
  }

  //Pregunta crear empresas
  async confirmacionCrearCompanies() {
    if (this.selected_opvalue == '') {
      this._toastProvider.cautionMessage('Por favor seleccione el Operador Virtual al cual asociar las compañías.');
      return;
    }

    const dialog = this._dialog.open(CompanyDialogComponent, {
      width: '450px',
      data: { titulo: 'Crear compañías', mensaje: '¿Desea crear las compañías seleccionadas?', respuesta: false }
    });

    dialog.afterClosed().subscribe(async resp => {
      if (resp.respuesta) {
        this.creandoCompanies = true;
        //Se obtiene tokken de usuario QA.
        await this.GetToken_QA()
          .then(async (tokenQA) => {
            //Asigno nuevo token QA
            GlobalConstants.tokenUserQA = String(tokenQA);
            this._toastProvider.infoMessage('Creando compañías seleccionadas, por favor no cierre esta ventana.');

            for await (const company_to_create of this.CompaniestoAuth) {
              if (this.ambiente == 'PRD') {
                await this.CreateCompaniesPRD(company_to_create);
              }
              else if (this.ambiente == 'QA') {
                await this.CreateCompaniesQA(company_to_create);
              }
              this._toastProvider.infoMessage(`Se creó compañía: ${company_to_create.documentnumber}`);
            }
          })
          .catch((err) => {
            this._toastProvider.dangerMessage(`Error al obtener Token QA: ${JSON.stringify(err)}`);
          })
          .finally(async () => {
            await this.sendCompanyCreations();
            this._AuthorizeCS.changeCtoAuth([]);
            this._AuthorizeCS.changelogCreateCompanies(this.CompaniesCreated_Log);
            this._AuthorizeCS.changemostrar_resultsLog(true);
            this.CompaniestoAuth.slice(0, this.CompaniestoAuth.length);
            this._AuthorizeCS.changeCtoAuth(this.CompaniestoAuth);
            this.dataSource.data = [];
            this.tarifas_to_create = { create: false, FE: [], DS: [], NE: [], DE: [] };
            this.creandoCompanies = false;
          });
      }
      else {
        this._toastProvider.infoMessage('Se canceló la operación.');
      }
    });
  }

  //Crear compañías PRD
  async CreateCompaniesPRD(company_to_create: CompanyR_UC) {
    //Se crean las compañías
    await this._CrearCompanyPRDService.CrearCompanyPRD(company_to_create, this.selected_opvalue)
      .finally(async () => {
        //Log de compañía actual
        var companyLog = this.CompaniesCreated_Log.find(x => x.Company_Utilities === company_to_create) || new CompanyCreationLog();
        await this._companiesQAService.awaitCompanies(this.selected_opvalue, companyLog)
          .finally(async () => {
            //crea usuario autorizado en PRD
            await this._crearUsuariosPRDService.CrearUsuario(company_to_create, this.selected_opvalueId, this.selected_opvalue)
              .finally(async () => {
                //crea series de Habilitacion en PRD
                await this._seriesHDianPRDService.CrearSerieHDian(company_to_create, this.selected_opvalue)
                  .finally(async () => {
                    //crea plam o paquetes de Emisión/Recepción Facturacion, Documento Soporte y Nomina PRD
                    await this._paquetesPRDService.CrearPaqueteEmision(company_to_create, this.selected_opvalue, this.selected_opvalueId, this.tarifas_to_create)
                      .finally(async () => {
                        //Crea servicios a compañía en QA
                        await this.CreateCompaniesQA(company_to_create);
                      });
                  });
              });
          })
      })
      .catch((err) => {
        this._toastProvider.dangerMessage(`Error al crear: ${company_to_create.documentnumber}. ` + JSON.stringify(err));
      });
  }

  //Crear compañías QA
  async CreateCompaniesQA(company_to_create: CompanyR_UC) {
    //Se crean las compañías
    await this._CrearCompanyService.CrearCompany(company_to_create, this.selected_opvalue)
      .finally(async () => {
        //Log de compañía actual
        var companyLog = this.CompaniesCreated_Log.find(x => x.Company_Utilities === company_to_create) || new CompanyCreationLog();
        await this._companiesQAService.awaitCompanies(this.selected_opvalue, companyLog)
          .finally(async () => {
            //crea usuario autorizado en QA
            await this._crearUsuariosService.CrearUsuario(company_to_create, this.selected_opvalueId, this.selected_opvalue)
              .finally(async () => {
                //crea series de Habilitacion
                await this._seriesHDianService.CrearSerieHDian(company_to_create, this.selected_opvalue)
                  .finally(async () => {
                    //crea series de Emisión
                    await this._seriesEmision.CrearSerieEmision(company_to_create, this.selected_opvalue, [])//Se crearán las series para todos los tipos de documentos, enviar tipos [] en caso de requerir menos tipos de documentos
                      .finally(async () => {
                        //crea plam o paquetes de Emisión/Recepción Facturacion, Documento Soporte y Nomina
                        await this._paquetesService.CrearPaqueteEmision(company_to_create, this.selected_opvalue, this.selected_opvalueId)
                          .finally(async () => {
                            companyLog = this.CompaniesCreated_Log.find(x => x.Company_Utilities === company_to_create) || new CompanyCreationLog();
                            await this.transaction_create(companyLog).finally(()=>{
                              //Elimina notificaciones asociadas a la empresa
                              this._NotificationsService.DeleteNotificationsByCompanyDocument(company_to_create.documentnumber).finally(()=> {
                                this._NotificationsService.suscribeActuallyNotificationsForce();
                              });
                            });
                          });
                      });
                  });
              });
          });
      })
      .catch((err) => {
        this._toastProvider.dangerMessage(`Error al crear: ${company_to_create.documentnumber}. ` + JSON.stringify(err));
      });
  }

  GetToken_QA() {
    return new Promise((resolve, reject) => {
      var body: LoginI = { userName: GlobalConstants.userQA, password: GlobalConstants.passwordQA, virtual_operator: '' };
      this._auth.GetToken(body, 'QA').subscribe(data => {
        let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
        if (dataRespomnsive.IsValid) {
          resolve(dataRespomnsive.ResultData.access_token.toString());
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  async transaction_create(CompanyLog: CompanyCreationLog) {
    //Envía transacción de creación o de actualización
    let transactionType = CompanyLog.General_Result ? this.ambiente == 'PRD' ? 3 : 2 : 1;
    let message = { QA: CompanyLog.Messages_QA, PRD: CompanyLog.Messages_PRD };
    let message_tosent = JSON.stringify(message);
    await this._transactionUService.enviarTransaccion(CompanyLog.Company_Utilities.documenttype, CompanyLog.Company_Utilities.documentnumber, transactionType, message_tosent);
  }

  distributorName(value: any) {
    let id = String(value!);
    let name = this.listdist.find(dist => dist.Id == id)?.Name;
    return (name == undefined ? 'NINGUNO' : name);
  }
}


