import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CompanyCreationLog,
  logs,
} from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { CompanySerieHabilitacion_UI } from 'src/app/models/Company-utilities/company-serie-habilitacion';
import { LoginI } from 'src/app/models/login.interface';
import { ResponseI } from 'src/app/models/response.interface';
import { CompanyS_I } from 'src/app/models/SearchCompany/searchCompany';
import { SeriesEmisionC } from 'src/app/models/SeriesEmision/SeriesEmision';
import { AuthService } from 'src/app/services/auth.service';
import { SerieEmisionPRDService } from 'src/app/services/SaphetyApi_PRD/serie-emision-prd.service';
import { SerieHDianPRDService } from 'src/app/services/SaphetyApi_PRD/serie-habilitacion-dian-prd.service.service';
import { SerieEmisionService } from 'src/app/services/SaphetyApi_QA/serie-emision.service';
import { SerieHDianService } from 'src/app/services/SaphetyApi_QA/serie-habilitacion-dian.service';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-admin-series-create',
  templateUrl: './admin-series-create.component.html',
  styleUrls: ['../admin-series.component.scss'],
})
export class AdminSeriesCreateComponent implements OnInit {
  @Input() companies_to_add: CompanyS_I[] = [];
  @Output() datasaliente: EventEmitter<boolean> = new EventEmitter();
  @Output() logsaliente: EventEmitter<any[]> = new EventEmitter();
  @Output() closesearchcompanies: EventEmitter<boolean> = new EventEmitter();

  //Almacena log compañías para creación de Series
  @HostBinding('class.is-open') CompaniesSeries_Log: CompanyCreationLog[] = [];

  FormGroup: FormGroup = new FormGroup({});
  FormGroupSeriesEmision: FormGroup = new FormGroup({});

  ambiente = 'QA'; //Almacena ambiente de login

  creando = false;

  createSerieH = true;
  createSerieE = false;

  documentTypes_Selected: {
    Code: string;
    Name: string;
    Serie: SeriesEmisionC;
    Selected: boolean;
  }[] = [];

  documentTypes_SE = [
    {
      Code: 'SalesInvoice',
      Name: 'SalesInvoice',
      Serie: new SeriesEmisionC(),
      Selected: false,
    },
    {
      Code: 'CreditNote',
      Name: 'CreditNote',
      Serie: new SeriesEmisionC(),
      Selected: false,
    },
    {
      Code: 'DebitNote',
      Name: 'DebitNote',
      Serie: new SeriesEmisionC(),
      Selected: false,
    },
  ];

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _formBuilder: FormBuilder,
    private _seriesHDian_QAService: SerieHDianService,
    private _seriesHDian_PRDService: SerieHDianPRDService,
    private _seriesEmision_QAService: SerieEmisionService,
    private _seriesEmision_PRDService: SerieEmisionPRDService,
    private _AuthorizeCS: AuthorizeCompanyService
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
    this._AuthorizeCS.logCreateCompanies.subscribe(
      (logs) => (this.CompaniesSeries_Log = logs)
    );
    if (this.ambiente == 'QA') {
      this.GetSEDocumentTypes_QA();
    } else if (this.ambiente == 'PRD') {
      //this.GetSEDocumentTypes_PRD();
    }

    this.FormGroup = this._formBuilder.group({
      series: this._formBuilder.group({
        name: ['Serie Habilitación DIAN', Validators.required],
        authorizationNumber: ['18760000001', Validators.required],
        prefix: ['SETT', Validators.required],
        validFrom: [new Date('2019-01-19T15:00:00'), Validators.required],
        validTo: [new Date('2030-01-19T05:00:00'), Validators.required],
        startValue: ['1', Validators.required],
        endValue: ['5000000', Validators.required],
        efectiveValue: ['1', Validators.required],
        technicalKey: ['fc8eac422eba16e22ffd8c6f94b3f40a6e38162c'],
        testSetId: ['', Validators.required],
      }),
    });

    this.FormGroupSeriesEmision = this._fb.group({
      Series: this._fb.array([]),
    });
  }

  ngOnInit(): void {
    //Reinicia log
    this._AuthorizeCS.changelogCreateCompanies([]);
  }

  buildForm() {
    const controlArray = this.FormGroupSeriesEmision.get('Series') as FormArray;

    this.documentTypes_Selected.forEach((serie) => {
      controlArray.push(
        this._fb.group({
          Name: [serie.Name, Validators.required],
          Selected: [serie.Selected, Validators.required],
          Serie: this._fb.group({
            Name: [serie.Serie.Name, Validators.required],
            AuthorizationNumber: [
              serie.Serie.AuthorizationNumber,
              Validators.required,
            ],
            Prefix: [serie.Serie.Prefix, Validators.required],
            ValidFrom: [serie.Serie.ValidFrom, Validators.required],
            ValidTo: [serie.Serie.ValidTo, Validators.required],
            StartValue: [serie.Serie.StartValue, Validators.required],
            EndValue: [serie.Serie.EndValue, Validators.required],
            EfectiveValue: [serie.Serie.EfectiveValue],
            DocumentType: [serie.Serie.DocumentType, Validators.required],
            TechnicalKey: [serie.Serie.TechnicalKey, Validators.required],
            AutoIncrement: [serie.Serie.AutoIncrement, Validators.required],
          }),
        })
      );
    });
  }

  isSelected_documentTypes_SE(i: number) {
    if (this.documentTypes_Selected[i].Selected) {
      this.documentTypes_Selected[i].Selected = false;
    } else {
      this.documentTypes_Selected[i].Selected = true;
    }
  }

  isAutoincrementada_SE(i: number) {
    if (this.documentTypes_Selected[i].Serie.AutoIncrement) {
      this.documentTypes_Selected[i].Serie.AutoIncrement = false;
    } else {
      this.documentTypes_Selected[i].Serie.AutoIncrement = true;
    }
  }

  //Obtiene Serie Emision DocumentTypes QA
  async GetSEDocumentTypes_QA() {
    await this.GetToken_QA().then(async (tokenQA) => {
      //Asigno nuevo token QA
      GlobalConstants.tokenUserQA = String(tokenQA);
    });

    await this._seriesEmision_QAService
      .SearchSerieEmisionDocumentTypes()
      .then((result) => {
        let newdocumentTypes: {
          Code: string;
          Name: string;
          Serie: SeriesEmisionC;
          Selected: boolean;
        }[] = JSON.parse(JSON.stringify(result));
        if (newdocumentTypes.length > 0) {
          this.documentTypes_SE.splice(0, this.documentTypes_SE.length);
          newdocumentTypes.forEach((newdtype) => {
            newdtype.Serie = new SeriesEmisionC();
            this.documentTypes_SE.push(newdtype);
          });
        }
      });

    this.documentTypes_SE.forEach((dType) => {
      dType.Serie.Name = 'Serie ' + dType.Name;
      this.documentTypes_Selected.push({
        Code: dType.Code,
        Name: dType.Name,
        Serie: dType.Serie,
        Selected: false,
      });
    });

    this.buildForm();
  }

  //Obtiene Serie Emision DocumentTypes PRD
  async GetSEDocumentTypes_PRD() {
    await this._seriesEmision_PRDService
      .SearchSerieEmisionDocumentTypes()
      .then((result) => {
        let newdocumentTypes: {
          Code: string;
          Name: string;
          Serie: SeriesEmisionC;
          Selected: boolean;
        }[] = JSON.parse(JSON.stringify(result));
        if (newdocumentTypes.length > 0) {
          this.documentTypes_SE.splice(0, this.documentTypes_SE.length);
          newdocumentTypes.forEach((newdtype) => {
            newdtype.Serie = new SeriesEmisionC();
            this.documentTypes_SE.push(newdtype);
          });
        }
      });

    this.documentTypes_Selected = [];
    this.documentTypes_SE.forEach((dType) => {
      if (dType.Code != 'SalesInvoice') {
        dType.Serie.Name = 'Serie ' + dType.Name;
        this.documentTypes_Selected.push({
          Code: dType.Code,
          Name: dType.Name,
          Serie: dType.Serie,
          Selected: false,
        });
      }
    });
  }

  RemoverCompany(company: CompanyS_I) {
    const index = this.companies_to_add.indexOf(company);
    if (index >= 0) {
      this.companies_to_add.splice(index, 1);
    }
  }

  AddCompanies() {
    this.datasaliente.emit(false);
  }

  async CreateSeries() {
    this.closesearchcompanies.emit(true);
    await this.GetToken_QA()
      .then(async (tokenQA) => {
        this.creando = true; //Indica creando para mostrar progress bar
        //Asigno nuevo token QA
        GlobalConstants.tokenUserQA = String(tokenQA);
        try {
          await this.CreateSeriesH();
        } catch {}

        try {
          await this.CreateSeriesE();
        } catch {}
      })
      .finally(() => {
        this.creando = false; //Indica creando para ocultar progress bar
        this.logsaliente.emit(this.CompaniesSeries_Log); //Emite culminación
      });
  }

  //Crea serie de Habilitación DIAN
  CreateSeriesH() {
    return new Promise(async (resolve, reject) => {
      try {
        for await (let companySaphety of this.companies_to_add) {
          let index = this.companies_to_add.indexOf(companySaphety);
          //Crea serie de Habilitación
          if (this.createSerieH) {
            if (!this.FormGroup.invalid) {
              let jsonseries = JSON.stringify(
                this.FormGroup.controls.series.value
              );
              let serieH: CompanySerieHabilitacion_UI = JSON.parse(jsonseries);

              let CompanyU = await this.companyUtilities(
                companySaphety,
                serieH,
                index
              );
              await this.newLog(companySaphety, CompanyU);

              if (this.ambiente == 'PRD') {
                //crea series de Habilitacion en PRD
                await this._seriesHDian_PRDService.CrearSerieHDian(
                  CompanyU,
                  companySaphety.SelectedOPVName
                );
              } else if (this.ambiente == 'QA') {
                //crea series de Habilitacion en QA
                await this._seriesHDian_QAService.CrearSerieHDian(
                  CompanyU,
                  companySaphety.SelectedOPVName
                );
              }
            }
          }
        }
        resolve(true);
      } catch {
        reject();
      }
    });
  }

  //Crea serie de Emisión para FV, NC y ND
  CreateSeriesE() {
    return new Promise(async (resolve, reject) => {
      try {
        for await (let companySaphety of this.companies_to_add) {
          let index = this.companies_to_add.indexOf(companySaphety);
          //Crea seriesde Emisión
          if (this.createSerieE) {
            let Series_Selected = await this.armar_SeriesE();
            if (Series_Selected.length > 0) {
              let CompanyU = await this.companyUtilities_SE(
                companySaphety,
                index
              );
              var creation = this.CompaniesSeries_Log.find(
                (x) => x.Company_Utilities.id === index
              );
              if (creation == undefined) {
                await this.newLog(companySaphety, CompanyU);
                creation = this.CompaniesSeries_Log.find(
                  (x) => x.Company_Utilities.id === index
                );
              }

              if (this.ambiente == 'PRD') {
                //crea series de Habilitacion en PRD
                //await this._seriesEmision_PRDService.CrearSerieEmision(CompanyU, companySaphety.SelectedOPVName, Series_Selected);
              } else if (this.ambiente == 'QA') {
                //crea series de Habilitacion en QA
                await this._seriesEmision_QAService.CrearSerieEmision(
                  CompanyU,
                  companySaphety.SelectedOPVName,
                  Series_Selected
                );
              }
            }
          }
        }
        resolve(true);
      } catch {
        reject();
      }
    });
  }

  armar_SeriesE() {
    return new Promise<
      { Code: string; Name: string; Serie: SeriesEmisionC; Selected: boolean }[]
    >((resolve) => {
      let Series_Selected: {
        Code: string;
        Name: string;
        Serie: SeriesEmisionC;
        Selected: boolean;
      }[] = [];
      const seriesform = this.FormGroupSeriesEmision.get('Series') as FormArray;
      for (var _i = 0; _i < this.documentTypes_Selected.length; _i++) {
        var serie: {
          Code: string;
          Name: string;
          Serie: SeriesEmisionC;
          Selected: boolean;
        } = seriesform.at(_i).value;
        if (serie.Selected) {
          let serieEmision: SeriesEmisionC = new SeriesEmisionC();
          serieEmision.Name = serie.Serie.Name;
          serieEmision.AuthorizationNumber = serie.Serie.AuthorizationNumber;
          serieEmision.Prefix = serie.Serie.Prefix;
          serieEmision.ValidFrom = serie.Serie.ValidFrom;
          serieEmision.ValidTo = serie.Serie.ValidTo;
          serieEmision.StartValue = serie.Serie.StartValue;
          serieEmision.EndValue = serie.Serie.EndValue;
          serieEmision.EfectiveValue = serie.Serie.AutoIncrement
            ? serie.Serie.EfectiveValue
            : null;
          serieEmision.DocumentType = this.documentTypes_Selected[_i].Code;
          serieEmision.TechnicalKey = serie.Serie.TechnicalKey;
          serieEmision.AutoIncrement = serie.Serie.AutoIncrement;
          serie.Serie = serieEmision;
          Series_Selected.push(serie);
        }
      }
      resolve(Series_Selected);
    });
  }

  companyUtilities(
    companySaphety: CompanyS_I,
    serieHDian: CompanySerieHabilitacion_UI | undefined,
    index: number
  ) {
    return new Promise<CompanyR_UC>((resolve) => {
      let companyU = new CompanyR_UC();
      if (serieHDian != undefined) {
        companyU.series.push(serieHDian);
      }
      companyU.id = index;
      companyU.name = companySaphety.Name;
      companyU.documenttype = companySaphety.Identification.DocumentType;
      companyU.countrycode = companySaphety.Address.Country;
      companyU.documentnumber = companySaphety.Identification.DocumentNumber;
      companyU.checkdigit = companySaphety.Identification.CheckDigit;

      resolve(companyU);
    });
  }

  companyUtilities_SE(companySaphety: CompanyS_I, index: number) {
    return new Promise<CompanyR_UC>((resolve) => {
      let companyU = new CompanyR_UC();
      companyU.id = index;
      companyU.name = companySaphety.Name;
      companyU.dataCreations = [
        {
          date_creation: new Date(),
          payrroll_included: true,
          salesinvoice_included: true,
          documentsuport_included: false,
          reception_salesinvoice_included: false,
          equivalentdocumentincluded: false
        },
      ];
      companyU.documenttype = companySaphety.Identification.DocumentType;
      companyU.countrycode = companySaphety.Address.Country;
      companyU.documentnumber = companySaphety.Identification.DocumentNumber;
      companyU.checkdigit = companySaphety.Identification.CheckDigit;

      resolve(companyU);
    });
  }

  newLog(companySaphety: CompanyS_I, CompanyU: CompanyR_UC) {
    return new Promise((resolve) => {
      let nuevolog: logs = {
        date: new Date(),
        module: 'Creación Series',
        message: 'Inicio de creación de series',
        status: true,
      };
      this.CompaniesSeries_Log.push({
        IdCompany_PRD: this.ambiente == 'PRD' ? companySaphety.Id : '',
        IdCompany_QA: this.ambiente == 'QA' ? companySaphety.Id : '',
        Company_Utilities: CompanyU,
        General_Result: true,
        Messages_PRD: this.ambiente == 'PRD' ? [nuevolog] : [],
        Messages_QA: this.ambiente == 'QA' ? [nuevolog] : [],
      });
      resolve(true);
    });
  }

  IsValidSeriesH_Form() {
    return new Promise<CompanySerieHabilitacion_UI>((resolve, reject) => {
      if (this.FormGroup.invalid) {
        reject(undefined);
      }
      let jsonseries = JSON.stringify(this.FormGroup.controls.series.value);
      var cSeries: CompanySerieHabilitacion_UI = JSON.parse(jsonseries);
      resolve(cSeries);
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
}
