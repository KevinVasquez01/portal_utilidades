import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipList } from '@angular/material/chips';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { CompanyResponsibility_UI } from 'src/app/models/Company-utilities/company-responsibility';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';
import { CompanySerieHabilitacion_UI } from 'src/app/models/Company-utilities/company-serie-habilitacion';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';

export interface responsability {
  Code: string;
  Name: string;
  selected: boolean;
}

@Component({
  selector: 'app-company-other-info',
  templateUrl: './company-other-info.component.html',
  styleUrls: ['../create-company.scss'],
})
export class CompanyOtherInfoComponent implements OnInit {
  //Almacena si se está editando compañía
  @HostBinding('class.is-open') editing = false;
  //Almacena compañía a editar
  @HostBinding('class.is-open') companytoEdit: CompanyR_UC = new CompanyR_UC();

  FormGroup: FormGroup = new FormGroup({});
  responsabilitytypes!: responsability[];
  responsabilitytypesselected: Array<CompanyResponsibility_UI> = [];
  onChange!: (value: string[]) => void;

  @ViewChild('chipList')
  chipList!: MatChipList;

  //Se utiliza para indicar si se llena la serie de habilitación
  disabled = false;
  @Output() datasaliente: EventEmitter<any> = new EventEmitter();

  //Alerta responsabilidades no seleccionados
  respSelection = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _getGetDataQA: APIGetServiceQA,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _toastProvider: ToastProvider
  ) {}

  ngOnInit(): void {
    this._AuthorizeCS.editing.subscribe((edit) => (this.editing = edit));
    this._AuthorizeCS.currentCompany.subscribe(
      (company) => (this.companytoEdit = company)
    );

    this.awaitDataElements();

    let companySerie!: CompanySerieHabilitacion_UI;
    if (this.editing) {
      companySerie = this.companytoEdit.series[0];
      this.companytoEdit.responsibilities.forEach((x) =>
        this.responsabilitytypesselected.push(x)
      );
    }

    this.FormGroup = this._formBuilder.group({
      responsabilityTypes: [
        this.editing ? this.companytoEdit.responsibilities : '',
        Validators.required,
      ],
      series: this._formBuilder.group({
        name: [
          this.editing
            ? companySerie != undefined
              ? companySerie.name
              : 'Serie Habilitación DIAN'
            : 'Serie Habilitación DIAN',
          Validators.required,
        ],
        authorizationnumber: [
          this.editing
            ? companySerie != undefined
              ? companySerie.authorizationnumber
              : '18760000001'
            : '18760000001',
          Validators.required,
        ],
        prefix: [
          this.editing
            ? companySerie != undefined
              ? companySerie.prefix
              : 'SETT'
            : 'SETT',
          Validators.required,
        ],
        validfrom: [
          this.editing
            ? companySerie != undefined
              ? companySerie.validfrom
              : new Date('2019-01-19T15:00:00')
            : new Date('2019-01-19T15:00:00'),
          Validators.required,
        ],
        validto: [
          this.editing
            ? companySerie != undefined
              ? companySerie.validto
              : new Date('2030-01-19T05:00:00')
            : new Date('2030-01-19T05:00:00'),
          Validators.required,
        ],
        startvalue: [
          this.editing
            ? companySerie != undefined
              ? companySerie.startvalue
              : '1'
            : '1',
          Validators.required,
        ],
        endvalue: [
          this.editing
            ? companySerie != undefined
              ? companySerie.endvalue
              : '5000000'
            : '5000000',
          Validators.required,
        ],
        efectivevalue: [
          this.editing
            ? companySerie != undefined
              ? companySerie.efectivevalue
              : '1'
            : '1',
          Validators.required,
        ],
        technicalkey: [
          this.editing
            ? companySerie != undefined
              ? companySerie.technicalkey
              : 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c'
            : 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
        ],
        testsetid: [
          this.editing
            ? companySerie != undefined
              ? companySerie.testsetid
              : ''
            : '',
          Validators.required,
        ],
      }),
    });
  }

  //Espera a que termine de obtener DataElements
  async awaitDataElements() {
    var responsabilityFunction = this.Responsabilities_Edting;
    var editing = this.editing;
    var selected = this.companytoEdit.responsibilities;

    await this.GetResponsabilitytypes().then(function (result) {
      if (editing) {
        selected.forEach((x) => responsabilityFunction(result, x));
      }
    });
  }

  Responsabilities_Edting(
    responsabilities: responsability[],
    selected: CompanyResponsibility_UI
  ) {
    var foundvalue = responsabilities.find(
      (x) => x.Code == selected.responsabilitytypes
    );
    if (foundvalue != undefined) {
      foundvalue.selected = true;
    }
  }

  //Obtiene Responsabilidades fiscales
  GetResponsabilitytypes() {
    return new Promise<responsability[]>((resolve, reject) => {
      this._getGetDataQA.GetDataElement('responsabilitytypes').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.responsabilitytypes = data['ResultData'];
            resolve(data['ResultData']);
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

  async onSubmit(next: boolean) {
    if (!next) {
      this.datasaliente.emit(next);
    } else {
      await this.getSelectedChips().then((response) => {
        if (this.FormGroup.invalid) {
          return;
        }
        var cResponsabilities: Array<CompanyResponsibility_UI> =
          this.responsabilitytypesselected;

        if (
          !this.disabled &&
          this.companytoEdit.dataCreations[0].salesinvoice_included
          
        ) {
          let jsonseries = JSON.stringify(this.FormGroup.controls.series.value);
          var cSeries: CompanySerieHabilitacion_UI = JSON.parse(jsonseries);
          this.companytoEdit.series = [cSeries];
        } else {
          this.companytoEdit.series = [];
        }
        this.companytoEdit.responsibilities = cResponsabilities;
        this._AuthorizeCS.changeEditingCompany(
          this.editing,
          this.companytoEdit
        );
        this.datasaliente.emit(next);

        if (this.editing) {
          this._toastProvider.infoMessage('Datos actualizados.');
        }
      });
    }
  }

  onSelectedChips() {
    setTimeout(() => {
      this.responsabilitytypesselected = [];
      this.chipList.chips.forEach((element) =>
        this.validateStatus(element.value, element.selected)
      );

      if (this.responsabilitytypesselected.length > 0) {
        this.respSelection = true;
      } else {
        this.respSelection = false;
      }
    }, 500);
  }

  getSelectedChips() {
    return new Promise((resolve) => {
      this.responsabilitytypesselected = [];
      this.chipList.chips.forEach((element) =>
        this.validateStatus(element.value, element.selected)
      );
      this.FormGroup.controls.responsabilityTypes.setValue(
        this.responsabilitytypesselected
      );

      if (this.responsabilitytypesselected.length > 0) {
        this.respSelection = true;
      } else {
        this.respSelection = false;
      }

      //En caso de no tener facturación se envía serie por defecto, la cual luego será omitida
      if (!this.companytoEdit.dataCreations[0].salesinvoice_included) {
        this.FormGroup.controls.series.setValue({
          name: 'FV',
          authorizationNumber: '18760000001',
          prefix: 'SETT',
          validFrom: new Date('2019-01-19T15:00:00'),
          validTo: new Date('2030-01-19T05:00:00'),
          startValue: 1,
          endValue: 5000000,
          efectiveValue: 1,
          technicalKey: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
          testSetId: '0',
        });
      }

      resolve(true);
    });
  }

  validateStatus(valor: string, status: boolean) {
    if (status) {
      this.responsabilitytypesselected.push({ responsabilitytypes: valor });
    }
  }

  isDisabled(event: any) {
    this.disabled = event!.checked!;
    //Seteo valores en caso de que usuario no conozca info
    if (this.disabled) {
      this.FormGroup.controls.series.setValue({
        name: 'FV',
        authorizationNumber: '18760000001',
        prefix: 'SETT',
        validFrom: new Date('2019-01-19T15:00:00'),
        validTo: new Date('2030-01-19T05:00:00'),
        startValue: 1,
        endValue: 5000000,
        efectiveValue: 1,
        technicalKey: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
        testSetId: '0',
      });
    } else {
      this.cleanSeries();
    }
  }

  cleanSeries() {
    if (!this.disabled) {
      this.FormGroup.get('series')?.setValue({
        name: 'Serie Habilitación DIAN',
        authorizationNumber: '18760000001',
        prefix: 'SETT',
        validFrom: new Date('2019-01-19T15:00:00'),
        validTo: new Date('2030-01-19T05:00:00'),
        startValue: 1,
        endValue: 5000000,
        efectiveValue: 1,
        technicalKey: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
        testSetId: '',
      });
    }
  }
}
