import {
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyContact_UI } from 'src/app/models/Company-utilities/company-contact';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { AuthorizeCompanyService } from 'src/app/services/UtilidadesAPI/authorize-company.service';

interface format {
  Code: string;
  Name: string;
}

@Component({
  selector: 'app-company-contact',
  templateUrl: './company-contact.component.html',
  styleUrls: ['../create-company.scss'],
})
export class CompanyContactComponent implements OnInit {
  //Almacena si se está editando compañía
  @HostBinding('class.is-open') editing = false;
  //Almacena compañía a editar
  @HostBinding('class.is-open') companytoEdit: CompanyR_UC = new CompanyR_UC();

  FormGroup: FormGroup = new FormGroup({});

  departmentCode: Array<format> = [];
  selected_departmentCode = this.departmentCode;
  cityCode: Array<format> = [];
  cityCodechild: Array<format> = [];
  selected_cityCode = this.cityCodechild;
  postalCode: Array<format> = [];
  postalCodechild: Array<format> = [];
  selected_postalCode: Array<format> = this.postalCodechild;
  codDepartamento = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _getGetDataQA: APIGetServiceQA,
    private _AuthorizeCS: AuthorizeCompanyService,
    private _toastProvider: ToastProvider
  ) {}

  @Output() datasaliente: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this._AuthorizeCS.editing.subscribe((edit) => (this.editing = edit));
    this._AuthorizeCS.currentCompany.subscribe(
      (company) => (this.companytoEdit = company)
    );

    this.awaitDataElements();

    this.FormGroup = this._formBuilder.group({
      addressLine: [
        this.editing ? this.companytoEdit.contacts[0].addressline : '',
        Validators.required,
      ],
      country: [
        this.editing ? this.companytoEdit.contacts[0].country : 'CO',
      ],
      departmentCode: [
        this.editing
          ? this.companytoEdit.contacts[0].departmentcode
          : '',
        Validators.required,
      ],
      cityCode: [
        this.editing ? this.companytoEdit.contacts[0].citycode : '',
        Validators.required,
      ],
      postalCode: [
        this.editing ? this.companytoEdit.contacts[0].postalcode : '',
        Validators.required,
      ],
      financialSupportEmail: [
        this.editing
          ? this.companytoEdit.contacts[0].financialsupportemail
          : '',
        [Validators.required, Validators.email],
      ],
      email1: [
        this.editing ? this.companytoEdit.contacts[0].email : '',
        [Validators.required, Validators.email],
      ],
    });
  }
  //Espera a que termine de obtener DataElements
  async awaitDataElements() {
    await this.GetDepartments();
    await this.GetCities();
    await this.GetPostalcodes();
  }

  //Obtiene departamentos
  GetDepartments() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('departments').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.departmentCode = JSON.parse(
              JSON.stringify(data['ResultData'])
            );
            this.selected_departmentCode = this.departmentCode;
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

  //Obtiene Ciudades
  GetCities() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('cities').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.cityCode = JSON.parse(JSON.stringify(data['ResultData']));

            if (this.editing) {
              this.cityCodechild = this.cityCode.filter(
                (option: { Code: string }) =>
                  option.Code.toLowerCase().startsWith(
                    this.companytoEdit.contacts[0].departmentcode
                  )
              );
              this.selected_cityCode = this.cityCodechild;
            }

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

  //Obtiene Códigos Postales
  GetPostalcodes() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.GetDataElement('postalcodes').subscribe(
        (data) => {
          if (data['IsValid']) {
            this.postalCode = JSON.parse(JSON.stringify(data['ResultData']));
            if (this.editing) {
              this.postalCodechild = this.postalCode.filter(
                (option: { Code: string }) =>
                  option.Code.toLowerCase().startsWith(
                    this.companytoEdit.contacts[0].postalcode
                  )
              );
              if (this.postalCodechild.length == 0) {
                this.selected_postalCode = [this.postalCode![0]];
              } else {
                this.selected_postalCode = this.postalCodechild;
              }
            }
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

  onSubmit() {}

  finalize(next: boolean) {
    if (!next) {
      this.datasaliente.emit(next);
    } else {
      if (this.FormGroup.invalid) {
        return;
      } else {
        let json = JSON.stringify(this.FormGroup.getRawValue());
        // var ccontact: CompanyContact_UI = JSON.parse(json);
        var ccontact: CompanyContact_UI = {
          addressline: this.FormGroup.controls['addressLine'].value,
          country: this.FormGroup.controls['country'].value,
          departmentcode: this.FormGroup.controls['departmentCode'].value,
          citycode: this.FormGroup.controls['cityCode'].value,
          postalcode: this.FormGroup.controls['postalCode'].value,
          financialsupportemail:
            this.FormGroup.controls['financialSupportEmail'].value,
          email: this.FormGroup.controls['email1'].value,
        };

        this.companytoEdit.contacts = [ccontact];
        this._AuthorizeCS.changeEditingCompany(
          this.editing,
          this.companytoEdit
        );
        this.datasaliente.emit(next);

        if (this.editing) {
          this._toastProvider.infoMessage('Datos actualizados.');
        }
      }
    }
  }

  //Modifica lista de ciudades, dependiendo del departamento
  changedepartmentselect(value: any) {
    if (value!.value == '') {
      return;
    }
    this.codDepartamento = value!.value;
    this.cityCodechild = this.cityCode.filter((option: { Code: string }) =>
      option.Code.toLowerCase().startsWith(value!.value)
    );
    this.selected_cityCode = this.cityCodechild;
    this.selected_postalCode = [];
  }

  //Modifica lista de códigos postales, dependiendo del departamento
  changecityselect(value: any) {
    this.selected_postalCode.push(this.postalCode![0]);
    let newCodes: Array<any> = this.postalCode.filter(
      (option: { Code: string }) =>
        option.Code.toLowerCase().startsWith(this.codDepartamento)
    );
    newCodes.forEach((element: any) => {
      this.selected_postalCode.push(element);
    });
  }

  // Códigos departamentos
  onKey_dcodes(event: any) {
    this.selected_departmentCode = this.search_dcodes(event.target.value);
  }

  search_dcodes(value: string) {
    let filter = value.toLowerCase();
    return this.departmentCode.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }

  // Códigos ciudades
  onKey_ccodes(event: any) {
    this.selected_cityCode = this.search_ccodes(event.target.value);
  }

  search_ccodes(value: string) {
    let filter = value.toLowerCase();
    return this.cityCodechild.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }

  // Códigos postales
  onKey_pcodes(event: any) {
    this.selected_postalCode = this.search_pcodes(event.target.value);
  }

  search_pcodes(value: string) {
    let filter = value.toLowerCase();
    return this.postalCodechild.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }
}
