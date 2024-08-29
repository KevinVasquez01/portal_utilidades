import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginI } from 'src/app/models/login.interface';
import { ResponseI } from 'src/app/models/response.interface';
import { CompanyS_I } from 'src/app/models/SearchCompany/searchCompany';
import {
  TranslationsResources,
  TranslationsResourcesResults,
} from 'src/app/models/TranslationsResources/translationsResources';
import { AuthService } from 'src/app/services/auth.service';
import { TranslationsResourcesServicePRD } from 'src/app/services/SaphetyApi_PRD/translations-resources.service';
import { TranslationsResourcesServiceQA } from 'src/app/services/SaphetyApi_QA/translations-resources.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HistoryChangesSincoDB } from '../history-changes-sinco/history-changes-sinco-currentcompany/history-changes-sinco-currentcompany';
import { HistoryChangesSincoCurrentcompanyService } from '../history-changes-sinco/history-changes-sinco-currentcompany/history-changes-sinco-currentcompany.service';
import { CustomizableFieldsSincoDialogComponent } from './customizable-fields-sinco-dialog/customizable-fields-sinco-dialog.component';

interface SectionTypes {
  Code: string;
  Name: string;
  Included: boolean;
}

const defaultDialogConfig = new MatDialogConfig();

@Component({
  selector: 'app-customizable-fields-sinco',
  templateUrl: './customizable-fields-sinco.component.html',
  styleUrls: ['./customizable-fields-sinco.component.scss'],
})
export class CustomizableFieldsSincoComponent implements OnInit {
  ambiente: any;
  showlogs = false;
  searchisclosed = true;

  companies_to_add: CompanyS_I[] = [];

  salesInvoice_Included = false;
  creditNote_Included = false;

  campoP1 = '';
  campoP2 = '';
  campoP3 = '';

  mainTypes: SectionTypes[] = [];
  footerTypesFV: SectionTypes[] = [];
  demandaTypesFV: SectionTypes[] = [];
  footerTypesNC: SectionTypes[] = [];
  demandaTypesNC: SectionTypes[] = [];

  main_all_Selected = true;
  footer_all_Selected = true;
  footer_all_SelectedNC = true;

  //Params
  SINCO_PARAM_MAX_CP1 = 5;
  SINCO_PARAM_MAX_CP2 = 5;
  SINCO_PARAM_MAX_CP3 = 5;
  SINCO_PARAM_Default_Items: string[] = [];

  finalTranslationsResources: TranslationsResources[] = [];
  results_finalTranslationsResources: {
    index: number;
    result: boolean;
    description: string;
  }[] = [];

  results = false;
  running = false;

  retry = false; //Reintento

  constructor(
    public dialog: MatDialog,
    private _translationsResourcesPRD: TranslationsResourcesServicePRD,
    private _translationsResourcesQA: TranslationsResourcesServiceQA,
    private _auth: AuthService,
    private _historyService: HistoryChangesSincoCurrentcompanyService,
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }

  config = {
    disableClose: false,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '',
    height: '',
    minWidth: '',
    minHeight: '',
    maxWidth: defaultDialogConfig.maxWidth,
    maxHeight: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    data: {
      tittle: '',
      image: '',
      body: [''],
      info: '',
    },
  };

  openContentElement(section: string) {
    let tittle = '';
    let image = '';
    let info = '';
    let body: string[] = [];

    if (section === 'camposP') {
      tittle = 'Campos Personalizables';
      image = 'camposP';
      info =
        'La información parametrizada en los campos Personalizables 1, 2 y 3, es compartida para los tipos de documento FV y NC.';
      body.push(
        'A continuación, se muestra la ubicación de los campos personalizables en el Documento FV. Lo anterior como guía en caso de no estar seguro de la sección en la que se muestran estos campos.'
      );
      body.push(
        'Los campos personalizables, aceptan una cantidad de líneas parametrizadas de la siguiente forma:'
      );
      body.push(
        `*Campo Personalizable 1: ${this.SINCO_PARAM_MAX_CP1} líneas como máximo, se recomiendan 5 Líneas.`
      );
      body.push(
        `*Campo Personalizable 2: ${this.SINCO_PARAM_MAX_CP2} líneas como máximo, se recomiendan 5 Líneas.`
      );
      body.push(
        `*Campo Personalizable 3: ${this.SINCO_PARAM_MAX_CP3} líneas como máximo, se recomiendan 5 Líneas.`
      );
    } else if (section === 'TProductos') {
      tittle = 'Tabla Productos';
      image = 'TProductos';
      info =
        'La información parametrizada para la Tabla de Productos o Servicios, es compartida para los tipos de documento FV y NC.';

      body.push(
        'A continuación, se muestra la ubicación de la Tabla de Productos o Servicios en el Documento FV.'
      );
      body.push(
        'Lo anterior como guía en caso de no estar seguro de la sección en la que se muestra esta tabla.'
      );
    } else if (section === 'TotalesFV') {
      tittle = 'Totales Factura de Venta';
      image = 'TotalesFV';
      info = '';

      body.push(
        'A continuación, se muestra la ubicación de los Totales en el Documento FV.'
      );
      body.push(
        'Lo anterior como guía en caso de no estar seguro de la sección en la que se muestran estos campos.'
      );
    } else if (section === 'TotalesNC') {
      tittle = 'Totales Nota Crédito';
      image = 'TotalesNC';
      info = '';
      body.push(
        'A continuación, se muestra la ubicación de los Totales en el Documento NC.'
      );
      body.push(
        'Lo anterior como guía en caso de no estar seguro de la sección en la que se muestran estos campos.'
      );
    } else if (section === 'CDemandaFV') {
      tittle = 'Campos por Demanda Factura de Venta';
      image = 'CDemandaFV';
      info = '';
      body.push(
        'A continuación, se muestra la ubicación de los Campos por Demanda en el Documento FV.'
      );
      body.push(
        'Lo anterior como guía en caso de no estar seguro de la sección en la que se muestran estos campos.'
      );
    } else if (section === 'CDemandaNC') {
      tittle = 'Campos por Demanda Nota Crédito';
      image = 'CDemandaNC';
      info = '';
      body.push(
        'A continuación, se muestra la ubicación de los Campos por Demanda en el Documento NC.'
      );
      body.push(
        'Lo anterior como guía en caso de no estar seguro de la sección en la que se muestran estos campos.'
      );
    }

    this.config.data.tittle = tittle;
    this.config.data.image = image;
    this.config.data.info = info;
    this.config.data.body = body;

    this.dialog.open(CustomizableFieldsSincoDialogComponent, this.config);
  }

  updateAllComplete_M() {
    this.main_all_Selected =
      this.mainTypes != null && this.mainTypes.every((t) => t.Included);
  }

  someComplete_M(): boolean {
    return (
      this.mainTypes.filter((t) => t.Included).length > 0 &&
      !this.main_all_Selected
    );
  }

  setAll_M(completed: boolean) {
    this.main_all_Selected = completed;
    this.mainTypes.forEach((t) => (t.Included = completed));
  }

  updateAllComplete_F() {
    this.footer_all_Selected =
      this.footerTypesFV != null && this.footerTypesFV.every((t) => t.Included);
  }

  someComplete_F(): boolean {
    return (
      this.footerTypesFV.filter((t) => t.Included).length > 0 &&
      !this.footer_all_Selected
    );
  }

  setAll_F(completed: boolean) {
    this.footer_all_Selected = completed;
    this.footerTypesFV.forEach((t) => (t.Included = completed));
  }

  updateAllComplete_NC() {
    this.footer_all_SelectedNC =
      this.footerTypesNC != null && this.footerTypesNC.every((t) => t.Included);
  }

  someComplete_NC(): boolean {
    return (
      this.footerTypesNC.filter((t) => t.Included).length > 0 &&
      !this.footer_all_SelectedNC
    );
  }

  setAll_NC(completed: boolean) {
    this.footer_all_SelectedNC = completed;
    this.footerTypesNC.forEach((t) => (t.Included = completed));
  }

  documentIncluded(document: string) {
    if (document === 'salesInvoice') {
      this.salesInvoice_Included = this.salesInvoice_Included ? false : true;
    } else if (document === 'creditNote') {
      this.creditNote_Included = this.creditNote_Included ? false : true;
    }
  }

  addCompanies() {
    this.searchisclosed = false;
  }

  removeCompany(company: CompanyS_I) {
    const index = this.companies_to_add.indexOf(company);
    if (index >= 0) {
      this.companies_to_add.splice(index, 1);
    }
  }

  receiveCompanySearch(companies: CompanyS_I[]) {
    this.companies_to_add = companies;
  }

  receiveCompanySearchClose(close: boolean) {
    this.searchisclosed = close;
    if (this.ambiente == 'PRD') {
      if (this.companies_to_add.length === 1) {
        this.searchResourcesPRD();
      } else {
        this.defaultValues();
      }
    } else {
      if (this.companies_to_add.length === 1) {
        this.searchResourcesQA();
      } else {
        this.defaultValues();
      }
    }
  }

  documentsTypesSelected() {
    if (this.salesInvoice_Included && this.creditNote_Included) {
      return 2;
    } else if (this.salesInvoice_Included) {
      return 1;
    } else if (this.creditNote_Included) {
      return 1;
    } else {
      return 0;
    }
  }

  async createQuestion() {
    this.finalTranslationsResources = [];
    this.results_finalTranslationsResources = [];
    this.results = false;
    this.running = true;
    for (let i = 0; i < this.companies_to_add.length; i++) {
      this.createResources(
        this.companies_to_add[i].Identification.DocumentNumber
      );
    }

    if (this.ambiente == 'PRD') {
      await this.createPRD();
      await this.createQA();
    } else {
      await this.createQA();
    }
  }

  async createPRD() {
    for (let i = 0; i < this.finalTranslationsResources.length; i++) {
      await this._translationsResourcesPRD
        .createTranslationsResource(this.finalTranslationsResources[i])
        .then(() => {
          this.results_finalTranslationsResources.push({
            index: i,
            result: true,
            description: 'Añadido con éxito ambiente PRD.',
          });
        })
        .catch(async (error) => {
          await this._translationsResourcesPRD
            .createTranslationsResource(this.finalTranslationsResources[i])
            .then(() => {
              this.results_finalTranslationsResources.push({
                index: i,
                result: true,
                description: 'Añadido con éxito ambiente PRD.',
              });
            })
            .catch((error) => {
              this.results_finalTranslationsResources.push({
                index: i,
                result: false,
                description: `Error al intentar añadir en ambiente PRD: ${JSON.stringify(
                  error
                )}`,
              });
            });
        });
    }
  }

  async createQA() {
    let run = true;
    if (this.ambiente == 'PRD') {
      //Se obtiene tokken de usuario QA.
      await this.GetToken_QA()
        .then(async (tokenQA) => {
          //Asigno nuevo token QA
          GlobalConstants.tokenUserQA = String(tokenQA);
        })
        .catch(() => {
          run = false;
        });
    }

    if (!run) {
      return;
    }

    for (let i = 0; i < this.finalTranslationsResources.length; i++) {
      await this._translationsResourcesQA
        .createTranslationsResource(this.finalTranslationsResources[i])
        .then(() => {
          this.results_finalTranslationsResources.push({
            index: i,
            result: true,
            description: 'Añadido con éxito ambiente QA.',
          });
        })
        .catch(async (error) => {
          await this._translationsResourcesQA
            .createTranslationsResource(this.finalTranslationsResources[i])
            .then(() => {
              this.results_finalTranslationsResources.push({
                index: i,
                result: true,
                description: 'Añadido con éxito ambiente QA.',
              });
            })
            .catch((error) => {
              this.results_finalTranslationsResources.push({
                index: i,
                result: false,
                description: `Error al intentar añadir en ambiente QA: ${JSON.stringify(
                  error
                )}`,
              });
            });
        });
    }

    this.results = true;
    this.running = false;
  }

  ngOnInit(): void {
    if (this.ambiente == 'PRD') {
      this.initialResourcesPRD();
    } else {
      this.initialResourcesQA();
    }
  }

  async initialResourcesPRD() {
    await this._translationsResourcesPRD
      .searchTranslationsResource('SINCO_PARAM_MAX_CP')
      .then((data) => {
        let results: TranslationsResourcesResults[] = JSON.parse(
          JSON.stringify(data)
        );
        for (let i = 0; i < results.length; i++) {
          if (results[i].Key === 'SINCO_PARAM_MAX_CP1') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            let number: number = parseInt(description, 10);
            this.SINCO_PARAM_MAX_CP1 = number > 0 ? number : 5;
          }

          if (results[i].Key === 'SINCO_PARAM_MAX_CP2') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            let number: number = parseInt(description, 10);
            this.SINCO_PARAM_MAX_CP2 = number > 0 ? number : 5;
          }

          if (results[i].Key === 'SINCO_PARAM_MAX_CP3') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            let number: number = parseInt(description, 10);
            this.SINCO_PARAM_MAX_CP3 = number > 0 ? number : 5;
          }
        }
      });

    await this._translationsResourcesPRD
      .searchTranslationsResource('SINCO_PARAM_Default_Items')
      .then((data) => {
        let results: TranslationsResourcesResults[] = JSON.parse(
          JSON.stringify(data)
        );
        for (let i = 0; i < results.length; i++) {
          if (results[i].Key === 'SINCO_PARAM_Default_Items') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            this.SINCO_PARAM_Default_Items = description.split(';');
          }
        }
      })
      .catch(() => {
        this.SINCO_PARAM_Default_Items = [
          'M_No',
          'M_Cod',
          'M_Detalle',
          'M_Cant',
          'M_UM',
          'M_PrecioUnitario',
          'M_Descuento',
          'M_IVA',
          'M_INC',
          'M_ICA',
          'M_ValorTotal',
          'F_Subtotal',
          'F_Descuento',
          'F_Iva',
          'F_ReteGarantia',
          'F_AmortAnticipo',
          'F_ReteFuente',
        ];
      });

    this.defaultValues();
  }

  async initialResourcesQA() {
    await this._translationsResourcesQA
      .searchTranslationsResource('SINCO_PARAM_MAX_CP')
      .then((data) => {
        let results: TranslationsResourcesResults[] = JSON.parse(
          JSON.stringify(data)
        );
        for (let i = 0; i < results.length; i++) {
          if (results[i].Key === 'SINCO_PARAM_MAX_CP1') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            let number: number = parseInt(description, 10);
            this.SINCO_PARAM_MAX_CP1 = number > 0 ? number : 5;
          }

          if (results[i].Key === 'SINCO_PARAM_MAX_CP2') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            let number: number = parseInt(description, 10);
            this.SINCO_PARAM_MAX_CP2 = number > 0 ? number : 5;
          }

          if (results[i].Key === 'SINCO_PARAM_MAX_CP3') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            let number: number = parseInt(description, 10);
            this.SINCO_PARAM_MAX_CP3 = number > 0 ? number : 5;
          }
        }
      });

    await this._translationsResourcesQA
      .searchTranslationsResource('SINCO_PARAM_Default_Items')
      .then((data) => {
        let results: TranslationsResourcesResults[] = JSON.parse(
          JSON.stringify(data)
        );
        for (let i = 0; i < results.length; i++) {
          if (results[i].Key === 'SINCO_PARAM_Default_Items') {
            let description =
              results[i].Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            this.SINCO_PARAM_Default_Items = description.split(';');
          }
        }
      })
      .catch(() => {
        this.SINCO_PARAM_Default_Items = [
          'M_No',
          'M_Cod',
          'M_Detalle',
          'M_Cant',
          'M_UM',
          'M_PrecioUnitario',
          'M_Descuento',
          'M_IVA',
          'M_INC',
          'M_ICA',
          'M_ValorTotal',
          'F_Subtotal',
          'F_Descuento',
          'F_Iva',
          'F_ReteGarantia',
          'F_AmortAnticipo',
          'F_ReteFuente',
        ];
      });

    this.defaultValues();
  }

  defaultValues() {
    this.campoP1 = '';
    this.campoP2 = '';
    this.campoP3 = '';

    let PARAM_Default_Items = this.SINCO_PARAM_Default_Items;
    function findType(code: string) {
      if (PARAM_Default_Items.find((x) => x === code)) {
        return true;
      } else {
        return false;
      }
    }

    this.mainTypes = [
      { Code: 'M_No', Name: 'No', Included: findType('M_No') },
      { Code: 'M_Cod', Name: 'Cód', Included: findType('M_Cod') },
      { Code: 'M_Detalle', Name: 'Detalle', Included: findType('M_Detalle') },
      { Code: 'M_Cant', Name: 'Cant', Included: findType('M_Cant') },
      { Code: 'M_UM', Name: 'U/M', Included: findType('M_UM') },
      {
        Code: 'M_PrecioUnitario',
        Name: 'Precio Unitario',
        Included: findType('M_PrecioUnitario'),
      },
      {
        Code: 'M_Descuento',
        Name: 'Descuento',
        Included: findType('M_Descuento'),
      },
      { Code: 'M_IVA', Name: 'IVA', Included: findType('M_IVA') },
      { Code: 'M_INC', Name: 'INC', Included: findType('M_INC') },
      { Code: 'M_ICA', Name: 'ICA', Included: findType('M_ICA') },
      {
        Code: 'M_ValorTotal',
        Name: 'Valor Total',
        Included: findType('M_ValorTotal'),
      },
    ];

    this.footerTypesFV = [
      {
        Code: 'F_Subtotal',
        Name: 'Subtotal',
        Included: findType('F_Subtotal'),
      },
      {
        Code: 'F_Descuento',
        Name: 'Descuento',
        Included: findType('F_Descuento'),
      },
      { Code: 'F_Iva', Name: 'Vr. IVA 19,00%', Included: findType('F_Iva') },
      {
        Code: 'F_ReteGarantia',
        Name: 'Retención en Garantía',
        Included: findType('F_ReteGarantia'),
      },
      {
        Code: 'F_AmortAnticipo',
        Name: 'Amortización de Anticipo',
        Included: findType('F_AmortAnticipo'),
      },
      {
        Code: 'F_ReteFuente',
        Name: 'Retención en la fuente',
        Included: findType('F_ReteFuente'),
      },
      { Code: 'F_ReteIVA', Name: 'Rete IVA', Included: findType('F_ReteIVA') },
      {
        Code: 'F_ReteICA',
        Name: 'Retención de ICA',
        Included: findType('F_ReteICA'),
      },
    ];

    this.demandaTypesFV = [
      {
        Code: 'H_Fecha',
        Name: 'Fecha Validación DIAN',
        Included: findType('H_Fecha'),
      },
    ];

    this.footerTypesNC = [
      { Code: 'CN_F_Subtotal', Name: 'Subtotal', Included: true },
      { Code: 'CN_F_Descuento', Name: 'Descuento', Included: true },
      { Code: 'CN_F_Iva', Name: 'Vr. IVA 19,00%', Included: true },
      {
        Code: 'CN_F_ReteGarantia',
        Name: 'Retención en Garantía',
        Included: true,
      },
      {
        Code: 'CN_F_AmortAnticipo',
        Name: 'Amortización de Anticipo',
        Included: true,
      },
      {
        Code: 'CN_F_ReteFuente',
        Name: 'Retención en la fuente',
        Included: true,
      },
      { Code: 'CN_F_ReteIVA', Name: 'Rete IVA', Included: false },
      { Code: 'CN_F_ReteICA', Name: 'Retención de ICA', Included: false },
    ];

    this.demandaTypesNC = [
      {
        Code: 'CN_H_Fecha',
        Name: 'Fecha Validación DIAN',
        Included: findType('CN_H_Fecha'),
      },
    ];

    this.main_all_Selected = this.mainTypes.find((x) => !x.Included)
      ? false
      : true;
    this.footer_all_Selected = this.footerTypesFV.find((x) => !x.Included)
      ? false
      : true;
    this.footer_all_SelectedNC = this.footerTypesNC.find((x) => !x.Included)
      ? false
      : true;
  }

  initialResources: TranslationsResources[] = [];

  async searchResourcesPRD() {
    this.defaultValues();
    let filter = `SINCO_PARAM_${this.companies_to_add[0]?.Identification.DocumentNumber}_`;
    await this._translationsResourcesPRD
      .searchTranslationsResource(filter)
      .then((data) => {
        let results: TranslationsResourcesResults[] = JSON.parse(
          JSON.stringify(data)
        );

        this.initialResources = [];
        let array: any[] = JSON.parse(JSON.stringify(data));
        array.forEach((description) => {
          let resultado: TranslationsResources[] = JSON.parse(
            JSON.stringify(description.Descriptions)
          );
          let esR = resultado.find((x) => x.LanguageCode === 'es-CO');
          if (esR != undefined) {
            this.initialResources.push(esR);
          }
        });

        function searchParam(param: string) {
          let result = results.find((x) => x.Key === `${filter}${param}`);
          if (result != undefined) {
            let description =
              result.Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            return description;
          }
          return '';
        }

        let PARAM_Default_Items = this.SINCO_PARAM_Default_Items;
        function findType(code: string) {
          if (PARAM_Default_Items.find((x) => x === code)) {
            return true;
          } else {
            return false;
          }
        }

        this.campoP1 = searchParam('CampoPersonalizable1')
          .split(';')
          .join('\n');
        this.campoP2 = searchParam('CampoPersonalizable2')
          .split(';')
          .join('\n');
        this.campoP3 = searchParam('CampoPersonalizable3')
          .split(';')
          .join('\n');

        for (let i = 0; i < this.mainTypes.length; i++) {
          let type = findType(this.mainTypes[i].Code);
          this.mainTypes[i].Included =
            searchParam(this.mainTypes[i].Code) !== '' &&
            searchParam(this.mainTypes[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.footerTypesFV.length; i++) {
          let type = findType(this.footerTypesFV[i].Code);
          this.footerTypesFV[i].Included =
            searchParam(this.footerTypesFV[i].Code) !== '' &&
            searchParam(this.footerTypesFV[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.footerTypesNC.length; i++) {
          let type = findType(this.footerTypesNC[i].Code.replace('CN_', ''));
          this.footerTypesNC[i].Included =
            searchParam(this.footerTypesNC[i].Code) !== '' &&
            searchParam(this.footerTypesNC[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.demandaTypesFV.length; i++) {
          let type = findType(this.demandaTypesFV[i].Code);
          this.demandaTypesFV[i].Included =
            searchParam(this.demandaTypesFV[i].Code) !== '' &&
            searchParam(this.demandaTypesFV[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.demandaTypesNC.length; i++) {
          let type = findType(this.demandaTypesNC[i].Code.replace('CN_', ''));
          this.demandaTypesNC[i].Included =
            searchParam(this.demandaTypesNC[i].Code) !== '' &&
            searchParam(this.demandaTypesNC[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }
      })
      .catch(() => {
        this.defaultValues();
      });
  }

  async searchResourcesQA() {
    this.defaultValues();
    let filter = `SINCO_PARAM_${this.companies_to_add[0]?.Identification.DocumentNumber}_`;
    await this._translationsResourcesQA
      .searchTranslationsResource(filter)
      .then((data) => {
        let results: TranslationsResourcesResults[] = JSON.parse(
          JSON.stringify(data)
        );

        this.initialResources = [];
        let array: any[] = JSON.parse(JSON.stringify(data));
        array.forEach((description) => {
          let resultado: TranslationsResources[] = JSON.parse(
            JSON.stringify(description.Descriptions)
          );
          let esR = resultado.find((x) => x.LanguageCode === 'es-CO');
          if (esR != undefined) {
            this.initialResources.push(esR);
          }
        });

        function searchParam(param: string) {
          let result = results.find((x) => x.Key === `${filter}${param}`);
          if (result != undefined) {
            let description =
              result.Descriptions.find((x) => x.LanguageCode === 'es-CO')
                ?.Description || '';
            return description;
          }
          return '';
        }

        let PARAM_Default_Items = this.SINCO_PARAM_Default_Items;
        function findType(code: string) {
          if (PARAM_Default_Items.find((x) => x === code)) {
            return true;
          } else {
            return false;
          }
        }

        this.campoP1 = searchParam('CampoPersonalizable1')
          .split(';')
          .join('\n');
        this.campoP2 = searchParam('CampoPersonalizable2')
          .split(';')
          .join('\n');
        this.campoP3 = searchParam('CampoPersonalizable3')
          .split(';')
          .join('\n');

        for (let i = 0; i < this.mainTypes.length; i++) {
          let type = findType(this.mainTypes[i].Code);
          this.mainTypes[i].Included =
            searchParam(this.mainTypes[i].Code) !== '' &&
            searchParam(this.mainTypes[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.footerTypesFV.length; i++) {
          let type = findType(this.footerTypesFV[i].Code);
          this.footerTypesFV[i].Included =
            searchParam(this.footerTypesFV[i].Code) !== '' &&
            searchParam(this.footerTypesFV[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.footerTypesNC.length; i++) {
          let type = findType(this.footerTypesNC[i].Code.replace('CN_', ''));
          this.footerTypesNC[i].Included =
            searchParam(this.footerTypesNC[i].Code) !== '' &&
            searchParam(this.footerTypesNC[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.demandaTypesFV.length; i++) {
          let type = findType(this.demandaTypesFV[i].Code);
          this.demandaTypesFV[i].Included =
            searchParam(this.demandaTypesFV[i].Code) !== '' &&
            searchParam(this.demandaTypesFV[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }

        for (let i = 0; i < this.demandaTypesNC.length; i++) {
          let type = findType(this.demandaTypesNC[i].Code.replace('CN_', ''));
          this.demandaTypesNC[i].Included =
            searchParam(this.demandaTypesNC[i].Code) !== '' &&
            searchParam(this.demandaTypesNC[i].Code) !== 'false'
              ? type
                ? false
                : true
              : type
              ? true
              : false;
        }
      })
      .catch(() => {
        this.defaultValues();
      });
  }

  GetToken_QA() {
    return new Promise((resolve, reject) => {
      var body: LoginI = {
        userName: GlobalConstants.userQA,
        password: GlobalConstants.passwordQA,
        virtual_operator: '',
      };
      this._auth.GetToken(body, 'QA').subscribe(
        (data) => {
          let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
          if (dataRespomnsive.IsValid) {
            resolve(dataRespomnsive.ResultData.access_token.toString());
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

  createResources(nit: string) {
    const param = `SINCO_PARAM_${nit}_`;
    let translationsResources: TranslationsResources[] = [];

    //Campo Personalizable 1
    let C1: TranslationsResources = new TranslationsResources();
    C1.ResourceKey = `${param}CampoPersonalizable1`;
    C1.Description = this.campoP1.split('\n').join(';');
    translationsResources.push(C1);

    //Campo Personalizable 2
    let C2: TranslationsResources = new TranslationsResources();
    C2.ResourceKey = `${param}CampoPersonalizable2`;
    C2.Description = this.campoP2.split('\n').join(';');
    translationsResources.push(C2);

    //Campo Personalizable 3
    let C3: TranslationsResources = new TranslationsResources();
    C3.ResourceKey = `${param}CampoPersonalizable3`;
    C3.Description = this.campoP3.split('\n').join(';');
    translationsResources.push(C3);

    let PARAM_Default_Items = this.SINCO_PARAM_Default_Items;
    function findType(code: string) {
      if (PARAM_Default_Items.find((x) => x === code)) {
        return true;
      } else {
        return false;
      }
    }

    //Main
    for (let i = 0; i < this.mainTypes.length; i++) {
      let main: TranslationsResources = new TranslationsResources();
      main.ResourceKey = `${param}${this.mainTypes[i].Code}`;
      let type = findType(this.mainTypes[i].Code);
      main.Description = this.mainTypes[i].Included
        ? type
          ? 'false'
          : 'true'
        : type
        ? 'true'
        : 'false';
      translationsResources.push(main);
    }

    //Si incluye FV
    if (this.salesInvoice_Included) {
      //footerTypesFV
      for (let i = 0; i < this.footerTypesFV.length; i++) {
        let foot: TranslationsResources = new TranslationsResources();
        foot.ResourceKey = `${param}${this.footerTypesFV[i].Code}`;
        let type = findType(this.footerTypesFV[i].Code);
        foot.Description = this.footerTypesFV[i].Included
          ? type
            ? 'false'
            : 'true'
          : type
          ? 'true'
          : 'false';
        translationsResources.push(foot);
      }

      //demandaTypesFV
      for (let i = 0; i < this.demandaTypesFV.length; i++) {
        let demanda: TranslationsResources = new TranslationsResources();
        demanda.ResourceKey = `${param}${this.demandaTypesFV[i].Code}`;
        let type = findType(this.demandaTypesFV[i].Code);
        demanda.Description = this.demandaTypesFV[i].Included
          ? type
            ? 'false'
            : 'true'
          : type
          ? 'true'
          : 'false';
        translationsResources.push(demanda);
      }
    }

    //Si incluye NC
    if (this.creditNote_Included) {
      //footerTypesNC
      for (let i = 0; i < this.footerTypesNC.length; i++) {
        let foot: TranslationsResources = new TranslationsResources();
        foot.ResourceKey = `${param}${this.footerTypesNC[i].Code}`;
        let type = findType(this.footerTypesNC[i].Code.replace('CN_', ''));
        foot.Description = this.footerTypesNC[i].Included
          ? type
            ? 'false'
            : 'true'
          : type
          ? 'true'
          : 'false';
        translationsResources.push(foot);
      }

      //demandaTypesNC
      for (let i = 0; i < this.demandaTypesNC.length; i++) {
        let demanda: TranslationsResources = new TranslationsResources();
        demanda.ResourceKey = `${param}${this.demandaTypesNC[i].Code}`;
        let type = findType(this.demandaTypesNC[i].Code);
        demanda.Description = this.demandaTypesNC[i].Included
          ? type
            ? 'false'
            : 'true'
          : type
          ? 'true'
          : 'false';
        translationsResources.push(demanda);
      }
    }

    for (let i = 0; i < translationsResources.length; i++) {
      this.finalTranslationsResources.push(translationsResources[i]);
      let eng: TranslationsResources = new TranslationsResources();
      eng.LanguageCode = 'en-GB';
      eng.ResourceKey = translationsResources[i].ResourceKey;
      eng.Description = translationsResources[i].Description;
      this.finalTranslationsResources.push(eng);
    }

    this.reporChange();
  }

  async reporChange() {
    const param = `SINCO_PARAM_${this.companies_to_add[0]?.Identification.DocumentNumber}_`;
    let final = this.finalTranslationsResources.filter(
      (x) => x.LanguageCode != 'en-GB'
    );
    let diferences: TranslationsResources[] = [];

    let changes: HistoryChangesSincoDB = {
      date_change: new Date(),
      company_name: this.companies_to_add[0]?.Name,
      document_number: this.companies_to_add[0]?.Identification.DocumentNumber,
      dv: this.companies_to_add[0]?.Identification.CheckDigit,
      custom_field1: '',
      custom_field2: '',
      custom_field3: '',
      other_changes: '',
      user_creator: '',
      is_macroplantilla: true,
      is_html: true,
    };

    for (let i = 0; final.length > i; i++) {
      let result = this.initialResources.find(
        (x) => x.ResourceKey === final[i].ResourceKey
      );
      if (result === undefined) {
        diferences.push(final[i]);
      } else if (result.Description !== final[i].Description) {
        diferences.push(final[i]);
      }
    }

    let PARAM_Default_Items = this.SINCO_PARAM_Default_Items;
    async function findType(code: string) {
        if (PARAM_Default_Items.find((x) => x === code)) {
          return true;
        } else {
          return false;
        }
      }

    for (let i = 0; diferences.length > i; i++) {
      let split = diferences[i].ResourceKey.split(param);
      let resource = split[split.length - 1];
      if (resource == 'CampoPersonalizable1') {
        changes.custom_field1 = diferences[i].Description;
      } else if (resource == 'CampoPersonalizable2') {
        changes.custom_field2 = diferences[i].Description;
      } else if (resource == 'CampoPersonalizable3') {
        changes.custom_field3 = diferences[i].Description;
      } else {
        let type = await findType(resource.replace('CN_', ''));
        let texto = '';

        if(type){
          if(diferences[i].Description === 'true'){
            texto = 'Retirado';
          }
          else{
            texto = 'Incluido';
          }
        }
        else{
          if(diferences[i].Description === 'false'){
            texto = 'Incluido';
          }
          else{
            texto = 'Retirado';
          }
        }

        if (changes.other_changes === '') {
          changes.other_changes += `<div fxLayout="row wrap" class="align-items-center m-t-15 m-b-15"> \
          <div fxFlex.gt-md="25" fxFlex.gt-lg="25" fxFlex="100"> \
          <span class="font-medium"> Recurso </span> \
          </div> \
          <div fxFlex.gt-md="75" class="text-right"> \
          <span class="font-medium"> Cambio </span> \
          </div>`;
        } else {
          changes.other_changes += `<div fxFlex.gt-md="25" fxFlex.gt-lg="25" fxFlex="100"> \
          <h6 class="m-t-5 m-b-0">${resource}</h6> \
          </div> \
          <div fxFlex.gt-md="75" class="text-right"> \
          <h6 class="m-t-5 m-b-0">${texto}</h6> \
          </div>`;
        }
      }
    }

    if (changes.other_changes != '') {
      changes.other_changes += `</div> \
      <hr />`;
    }

    let user = localStorage.getItem('user') + '';
    changes.user_creator = user;
    changes.other_changes.trim();
    this._historyService.NewHistoryChangesSinco(changes);
  }

  avance() {
    if (this.ambiente == 'PRD') {
      let avance = (this.results_finalTranslationsResources.length + 2) / 2;
      let avanceInt = parseInt(avance.toString());
      let total = this.finalTranslationsResources.length;
      return `Creando Campos Personalizables: ${avanceInt} de ${total}, por favor no cierre esta ventana.`;
    } else {
      let avance = this.results_finalTranslationsResources.length + 1;
      let total = this.finalTranslationsResources.length;
      return `Creando Campos Personalizables: ${avance} de ${total}, por favor no cierre esta ventana.`;
    }
  }

  receiveRetry() {
    this.retry = true;
    this.createQuestion();
  }

  countActuallyLines(campoP: string) {
    return campoP.split('\n').length;
  }
}
