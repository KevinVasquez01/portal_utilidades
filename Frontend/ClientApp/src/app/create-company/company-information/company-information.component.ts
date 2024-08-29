import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyDataCreation_UI } from 'src/app/models/Company-utilities/company-datacreation';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';

export interface service {
  Code: string;
  Name: string;
  selected: boolean;
}

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['../create-company.scss'],
  providers: [DatePipe],
})
export class CompanyInformationComponent implements OnInit {
  //Almacena si se está editando compañía
  @HostBinding('class.is-open') editing = false;
  //Almacena compañía a editar
  @HostBinding('class.is-open') companytoEdit: CompanyR_UC = new CompanyR_UC();

  FormGroup: FormGroup = new FormGroup({});
  services_selected: service[] = [
    { Code: 'FE', Name: 'Servicios Facturación Electrónica', selected: false },
    { Code: 'DS', Name: 'Servicios Documento Soporte', selected: false },
    { Code: 'NE', Name: 'Servicios Nómina Electrónica', selected: false },
    { Code: 'RFE', Name: 'Recepción Facturación Electrónica', selected: false },
    { Code: 'DE', Name: 'Documento Equivalente Electrónico', selected: false },
  ];

  identificationfypeSelected: string = 'NIT';
  legalSelected: string = '';

  identificationdocumenttypes: Array<{ Code: string; Name: string }> = [
    { Code: 'NIT', Name: 'NIT' },
  ];
  selected_identificationdocumenttypes = this.identificationdocumenttypes;
  countrycodes!: any;
  selected_countrycodes = this.countrycodes;
  legaltypes: Array<{ Code: string; Name: string }> = [
    { Code: 'Legal', Name: 'Jurídica' },
    { Code: 'Natural', Name: 'Natural' },
  ];
  selected_legaltypes = this.legaltypes;
  timezones!: any;
  selected_timezones = this.timezones;
  taxschemes!: any;
  selected_taxschemes = this.taxschemes;

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];

  order_listdist: Array<string> = [
    'NINGUNO',
    'PREPAGO',
    'POSPAGO',
    'SINCO',
    'OFIMA',
    'ATXEL',
    'GLOBAL BPO',
  ];

  //Alerta servicios contratados no seleccionados
  servSelection = true;

  @Output() datasaliente: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private _getGetDataQA: APIGetServiceQA,
    private _miDatePipe: DatePipe,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _toastProvider: ToastProvider,
    private _dataElementsU: DataElementsService
  ) {
    this.awaitDataElements();
  }

  ngOnInit(): void {
    this._AuthorizeCS.editing.subscribe((edit) => (this.editing = edit));
    this._AuthorizeCS.currentCompany.subscribe(
      (company) => (this.companytoEdit = company)
    );

    this.legalSelected = this.editing ? this.companytoEdit.legaltype : '';

    this.FormGroup = this._formBuilder.group({
      company: this._formBuilder.group({
        id: [this.editing ? this.companytoEdit.id : 0],
        documenttype: [
          this.editing ? this.companytoEdit.documenttype! : 'NIT',
          Validators.required,
        ],
        countrycode: [
          this.editing ? this.companytoEdit.countrycode! : 'CO',
          Validators.required,
        ],
        documentnumber: [
          this.editing ? this.companytoEdit.documentnumber! : '',
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        checkdigit: [
          this.editing ? this.companytoEdit.checkdigit! : '',
          [
            Validators.required,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
            Validators.minLength(1),
            Validators.maxLength(1),
          ],
        ],
        languagecode: [
          this.editing ? this.companytoEdit.languagecode! : 'es-CO',
        ],
        timezonecode: [
          this.editing ? this.companytoEdit.timezonecode! : 'America/Bogota',
        ],
        taxscheme: [
          this.editing ? this.companytoEdit.taxscheme! : '',
          Validators.required,
        ],
        legaltype: [
          this.editing ? this.companytoEdit.legaltype! : '',
          Validators.required,
        ],
        firstname: [this.editing ? this.companytoEdit.firstname! : ''],
        familyname: [this.editing ? this.companytoEdit.familyname! : ''],
        middlename: [this.editing ? this.companytoEdit.middlename! : ''],
        name: [this.editing ? this.companytoEdit.name! : ''],
        virtualoperator: [
          this.editing ? this.companytoEdit.virtualoperator! : '',
        ],
        distributorid: [
          this.editing
            ? this.companytoEdit.distributorid == ''
              ? '0'
              : this.companytoEdit.distributorid!
            : '',
        ],
        namepackageorplan: [
          this.editing ? this.companytoEdit.namepackageorplan! : '',
        ],
        packdefault: [this.editing ? this.companytoEdit.packdefault! : true],
      }),
      dataCreation: this._formBuilder.group({
        date_creation: [
          this.editing
            ? this.companytoEdit.dataCreations[0].date_creation
            : '',
          Validators.required,
        ],
        payrroll_included: [
          this.editing
            ? this.companytoEdit.dataCreations[0].payrroll_included
            : false,
        ],
        salesinvoice_included: [
          this.editing
            ? this.companytoEdit.dataCreations[0].salesinvoice_included
            : false,
        ],
        documentsuport_included: [
          this.editing
            ? this.companytoEdit.dataCreations[0].documentsuport_included
            : false,
        ],
        reception_salesinvoice_included: [
          this.editing
            ? this.companytoEdit.dataCreations[0].reception_salesinvoice_included
            : false,
        ],
        equivalentdocumentincluded: [
          this.editing
            ? this.companytoEdit.dataCreations[0].equivalentdocumentincluded
            : false,
        ],
      }),
    });

    //Si se está editando, asocia valores a botones de servicios
    this.editingselectservice();
  }

  //Espera a que termine de obtener DataElements
  async awaitDataElements() {
    await this.GetCountries();
    await this.GetTimezones();
    await this.GetTaxschemes();
    await this.GetDistributors();
  }

  //Establece orden de Distributors
  async order_Distributors(distributors: Array<jsonDistI>) {
    let newDistributors: Array<jsonDistI> = [];
    await Promise.all(
      this.order_listdist.map((order_dist) => {
        let exist = distributors.find((x) => x.Name === order_dist);
        if (exist != undefined) {
          newDistributors.push(exist);
        }
      })
    );

    await Promise.all(
      distributors.map((dist) => {
        let exist = this.order_listdist.find((x) => x === dist.Name);
        if(exist === undefined){
          newDistributors.push(dist);
        }
      })
    );
    return newDistributors;
  }

  //Obtiene distribuidores de UtilidadesAPI
  GetDistributors() {
    return new Promise(async (resolve, reject) => {
      this._dataElementsU
        .getDdataelementU('Distribuidores')
        .then(async (result) => {
          //Desde servicio Utilidades
          let distributors: Array<jsonDistI> = JSON.parse(result.json);
          distributors.sort((a, b) => a.Name.localeCompare(b.Name));
          this.listdist = await this.order_Distributors(distributors);
          resolve(true);
        })
        .catch(() => {
          //Lee JSON distribuidores
          this.listdist = [];
          reject();
        });
    });
  }

  //Obtiene países
  GetCountries() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('countrycodes').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.countrycodes = data['ResultData'];
            this.selected_countrycodes = this.countrycodes;
            resolve(true);
          } else {
            reject();
          }
        },
        (error) => {
          reject();
        }
      );
    });
  }

  //Obtiene Zonas horarias
  GetTimezones() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('timezones').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.timezones = data['ResultData'];
            this.selected_timezones = this.timezones;
            resolve(true);
          } else {
            reject();
          }
        },
        (error) => {
          reject();
        }
      );
    });
  }

  //Obtiene Taxschemes
  GetTaxschemes() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('taxschemes').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.taxschemes = data['ResultData'];
            this.selected_taxschemes = this.taxschemes;
            resolve(true);
          } else {
            reject();
          }
        },
        (error) => {
          reject();
        }
      );
    });
  }

  onSubmit() {
    let company = this.FormGroup.controls.company.value;
    //Seteo valores en caso de que usuario intente llenar info de persona natural y jurídica
    if (this.legalSelected == 'Legal') {
      company.firstName = '';
      company.familyName = '';
    } else {
      company.name = '';
    }
    this.FormGroup.controls.company.setValue(company);

    if (this.FormGroup.invalid) {
      this.onselectservice();
      return;
    } else {
      let jsoncompany = JSON.stringify(this.FormGroup.controls.company.value);
      var comp: CompanyR_UC = JSON.parse(jsoncompany);
      let jsondatacreation = JSON.stringify(
        this.FormGroup.controls.dataCreation.value
      );
      var cdatacreation: CompanyDataCreation_UI = JSON.parse(jsondatacreation);
      cdatacreation.date_creation = new Date();
      this.companytoEdit.id = comp.id;
      this.companytoEdit.documenttype = comp.documenttype;
      this.companytoEdit.countrycode = comp.countrycode;
      this.companytoEdit.documentnumber = comp.documentnumber;
      this.companytoEdit.checkdigit = comp.checkdigit;
      this.companytoEdit.languagecode = comp.languagecode;
      this.companytoEdit.timezonecode = comp.timezonecode;
      this.companytoEdit.taxscheme = comp.taxscheme;
      this.companytoEdit.legaltype = comp.legaltype;
      this.companytoEdit.firstname = comp.firstname;
      this.companytoEdit.familyname = comp.familyname;
      this.companytoEdit.middlename = comp.middlename;
      this.companytoEdit.name = comp.name;
      this.companytoEdit.virtualoperator = comp.virtualoperator;
      this.companytoEdit.distributorid =
        comp.distributorid == '0' ? '' : comp.distributorid;
      this.companytoEdit.namepackageorplan = comp.namepackageorplan;
      this.companytoEdit.packdefault = comp.packdefault;
      this.companytoEdit.dataCreations = [cdatacreation];
      this._AuthorizeCS.changeEditingCompany(this.editing, this.companytoEdit);
      this.datasaliente.emit(true);

      if (this.editing) {
        this._toastProvider.infoMessage('Datos actualizados.');
      }
    }
  }

  // Tipos identificacion
  onKey_itypes(event: any) {
    this.selected_identificationdocumenttypes = this.search_itypes(
      event.target.value
    );
  }
  search_itypes(value: string) {
    let filter = value.toLowerCase();
    return this.identificationdocumenttypes.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }

  // Legal
  onKey_ltypes(event: any) {
    this.selected_legaltypes = this.search_ltypes(event.target.value);
  }
  search_ltypes(value: string) {
    let filter = value.toLowerCase();
    return this.legaltypes.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }

  // Paises
  onKey_countries(event: any) {
    this.selected_countrycodes = this.search_countries(event.target.value);
  }
  search_countries(value: string) {
    let filter = value.toLowerCase();
    return this.countrycodes.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }

  //Al cambiar el tipo de persona
  legalSelectChange(value: any) {
    if (value!.value == '') {
      return;
    }
    this.legalSelected = value!.value;
  }

  //Al cambiar el tipo de identificación
  identificationSelectChange(value: any) {
    if (value!.value == '') {
      return;
    }
    this.identificationfypeSelected = value!.value;
  }

  editingselectservice() {
    if (this.editing) {
      this.services_selected[0].selected =
        this.companytoEdit.dataCreations[0].salesinvoice_included;
      this.services_selected[1].selected =
        this.companytoEdit.dataCreations[0].documentsuport_included;
        this.services_selected[2].selected =
        this.companytoEdit.dataCreations[0].payrroll_included;
        this.services_selected[3].selected =
        this.companytoEdit.dataCreations[0].reception_salesinvoice_included;
        this.services_selected[4].selected =
        this.companytoEdit.dataCreations[0].equivalentdocumentincluded;
    }
  }

  onselectservice() {
    if (
      !this.services_selected[0].selected &&
      !this.services_selected[1].selected &&
      !this.services_selected[2].selected &&
      !this.services_selected[3].selected &&
      !this.services_selected[4].selected
    ) {
      this.servSelection = false;
      this.FormGroup.controls.dataCreation.setValue({
        date_creation: '',
        payrroll_included: '',
        salesinvoice_included: '',
        documentsuport_included: '',
        reception_salesinvoice_included: '',
        equivalentdocumentincluded: ''
      });
      return;
    }

    this.servSelection = true;
    this.FormGroup.controls.dataCreation.setValue({
      date_creation: this._miDatePipe.transform(Date(), 'yyyy-MM-dd'),
      payrroll_included: this.services_selected[2].selected,
      salesinvoice_included: this.services_selected[0].selected,
      documentsuport_included: this.services_selected[1].selected,
      reception_salesinvoice_included: this.services_selected[3].selected,
      equivalentdocumentincluded: this.services_selected[4].selected,
    });
  }

  calcularDigitoVerificacion(myNit: any) {
    var vpri, x, y, z;

    // Se limpia el Nit
    myNit = myNit.replace(/\s/g, ''); // Espacios
    myNit = myNit.replace(/,/g, ''); // Comas
    myNit = myNit.replace(/\./g, ''); // Puntos
    myNit = myNit.replace(/-/g, ''); // Guiones

    // Se valida el nit
    if (isNaN(myNit)) {
      //console.log("El nit/cédula '" + myNit + "' no es válido(a).");
      return '';
    }

    // Procedimiento
    vpri = new Array(16);
    z = myNit.length;

    vpri[1] = 3;
    vpri[2] = 7;
    vpri[3] = 13;
    vpri[4] = 17;
    vpri[5] = 19;
    vpri[6] = 23;
    vpri[7] = 29;
    vpri[8] = 37;
    vpri[9] = 41;
    vpri[10] = 43;
    vpri[11] = 47;
    vpri[12] = 53;
    vpri[13] = 59;
    vpri[14] = 67;
    vpri[15] = 71;

    x = 0;
    y = 0;
    for (var i = 0; i < z; i++) {
      y = myNit.substr(i, 1);
      // console.log ( y + "x" + vpri[z-i] + ":" ) ;

      x += y * vpri[z - i];
      // console.log ( x ) ;
    }

    y = x % 11;
    // console.log ( y ) ;

    return y > 1 ? 11 - y : y;
  }

  // Calcular
  DigitoVerificacion() {
    let company = this.FormGroup.controls.company.value;
    let nit = company['documentNumber'];

    // Verificar que haya un numero
    let isNitValid = nit >>> 0 === parseFloat(nit) ? true : false; // Validate a positive integer
    // Si es un número se calcula el Dígito de Verificación
    if (isNitValid) {
      this.FormGroup.controls.company.patchValue({
        checkDigit: String(this.calcularDigitoVerificacion(nit)),
      });
    }
  }
}
