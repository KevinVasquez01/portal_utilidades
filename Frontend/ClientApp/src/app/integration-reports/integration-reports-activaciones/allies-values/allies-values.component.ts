import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlliesNames } from 'src/app/models/Reports/allies-names';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { IntegrationReportsDialogComponent } from '../../integration-reports-dialog/integration-reports-dialog.component';
import { AlliesValuesDialogComponent } from './allies-values-dialog/allies-values-dialog.component';

interface AlliesNames_Table {
  Id: number;
  OV_Name: string;
  PayRoll_Activation_Value: number;
  Invoice_Activation_Value: number;
  Support_Document_Value: number;
  Reception_Activation_Value: number;
  Equivalent_Document_Value: number;
  Editing: boolean;
}

@Component({
  selector: 'app-allies-values',
  templateUrl: './allies-values.component.html',
  styleUrls: ['./allies-values.component.scss'],
})
export class AlliesValuesComponent implements OnInit {
  AlliesNames_List: Array<AlliesNames> = [];
  AlliesNames_Table: Array<AlliesNames_Table> = [];
  isLoadingResults: boolean = true;
  LoadingResults_Errors: string[] = [];
  AlliesNames_Created: number = 0;

  eventForm: FormGroup = new FormGroup({});

  dialogRef: MatDialogRef<AlliesValuesDialogComponent> =
    Object.create(NullTemplateVisitor);

  constructor(
    private _dataElementsU: DataElementsService,
    public _dialog: MatDialog,
    private _toastProvider: ToastProvider
  ) {
    this.eventForm = new FormGroup({
      OV_Name: new FormControl(''),
      PayRoll_Activation_Value: new FormControl(
        '0',
        Validators.pattern('^[0-9]*$')
      ),
      Invoice_Activation_Value: new FormControl(
        '0',
        Validators.pattern('^[0-9]*$')
      ),
      Support_Document_Value: new FormControl(
        '0',
        Validators.pattern('^[0-9]*$')
      ),
      Equivalent_Document_Value: new FormControl(
        '0',
        Validators.pattern('^[0-9]*$')
      ),
    });
  }

  async ngOnInit() {
    //Obtiene Reports_AlliesNames de UtilidadesAPI
    await this.awaitReportsAlliesNames();
  }

  async awaitReportsAlliesNames() {
    this.LoadingResults_Errors = [];
    await this._dataElementsU
      .getDdataelementU('Reports_AlliesNames')
      .then((result) => {
        //Desde servicio Utilidades
        this.AlliesNames_List = JSON.parse(result.json);
        let index = 0;
        this.AlliesNames_List.forEach((x) => {
          let aName: AlliesNames_Table = {
            Id: index,
            OV_Name: x.OV_Name,
            PayRoll_Activation_Value: x.PayRoll_Activation_Value,
            Invoice_Activation_Value: x.Invoice_Activation_Value,
            Support_Document_Value: x.Support_Document_Value,
            Reception_Activation_Value: x.Reception_Activation_Value,       
            Equivalent_Document_Value: x.Equivalent_Document_Value,
            Editing: false,
          };
          this.AlliesNames_Table.push(aName);
          index++;
        });

        this.isLoadingResults = false;
      })
      .catch((error) => {
        this.LoadingResults_Errors.push(JSON.stringify(error));
      });
  }

  deleteEvent(event: AlliesNames_Table) {
    const dialog = this._dialog.open(IntegrationReportsDialogComponent, {
      width: '450px',
      data: {
        titulo: `Eliminar Precios Aliado`,
        mensaje: `¿Desea eliminar el aliado: ${event.OV_Name}?`,
        respuesta: false,
      },
    });

    dialog.afterClosed().subscribe(async (resp) => {
      if (resp.respuesta) {
        this.saveChanges(event, 'delete');
      } else {
        this._toastProvider.infoMessage('Se canceló eliminación.');
      }
    });
  }

  editEvent(event: AlliesNames_Table, str: string) {
    if (str === 'save') {
      this.saveChanges(event, 'edit');
    } else if (str === 'edit') {
      try {
        this.AlliesNames_Table.map(function (dato) {
          if (dato == event) {
            dato.Editing = true;
          }
          return dato;
        });
      } catch {
        return;
      }
    }
  }

  addAllieNames() {
    this.dialogRef = this._dialog.open(AlliesValuesDialogComponent, {
      width: '650px',
      data: { titulo: 'Añadir Aliado', respuesta: false },
    });

    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (!res) {
        return;
      }

      let result: AlliesNames = JSON.parse(JSON.stringify(res.event));
      let index = this.AlliesNames_Table.length;
      let newAlliesNames_Table: AlliesNames_Table = {
        Id: index,
        OV_Name: result.OV_Name,
        PayRoll_Activation_Value: result.PayRoll_Activation_Value,
        Invoice_Activation_Value: result.Invoice_Activation_Value,
        Support_Document_Value: result.Support_Document_Value,
        Reception_Activation_Value: result.Reception_Activation_Value,        
        Equivalent_Document_Value: result.Equivalent_Document_Value,
        Editing: false,
      };

      this.saveChanges(newAlliesNames_Table, 'add');
    });
  }

  async saveChanges(event: AlliesNames_Table, type: string) {
    let texto = {
      succes: type === 'edit' ? 'editó' : type === 'add' ? 'añadió' : 'eliminó',
      error:
        type === 'edit' ? 'editar' : type === 'add' ? 'añadir' : 'eliminar',
    };

    //Modifico aliado en Array
    let result = this.AlliesNames_List[event.Id];
    let indexof = this.AlliesNames_List.indexOf(result);
    if (indexof < 0) {
      this.AlliesNames_List.push({
        OV_Name: event.OV_Name,
        PayRoll_Activation_Value: event.PayRoll_Activation_Value,
        Invoice_Activation_Value: event.Invoice_Activation_Value,
        Support_Document_Value: event.Support_Document_Value,
        Reception_Activation_Value: event.Reception_Activation_Value,        
        Equivalent_Document_Value: event.Equivalent_Document_Value,
      });
    } else {
      this.AlliesNames_List[indexof] = {
        OV_Name: event.OV_Name,
        PayRoll_Activation_Value: event.PayRoll_Activation_Value,
        Invoice_Activation_Value: event.Invoice_Activation_Value,
        Support_Document_Value: event.Support_Document_Value,
        Reception_Activation_Value: event.Reception_Activation_Value,        
        Equivalent_Document_Value: event.Equivalent_Document_Value,
      };

      if (type === 'delete') {
        this.AlliesNames_List.splice(indexof, 1);
      }
    }

    await this._dataElementsU
      .updateAlliesNames(this.AlliesNames_List)
      .then(() => {
        this._toastProvider.successMessage(
          `Se ${texto.succes} Aliado (${event.OV_Name}) con éxito.`
        );
        this.AlliesNames_Table.map(function (dato) {
          if (dato.Id == event.Id) {
            dato.Editing = false;
          }
          return dato;
        });

        if (type === 'add') {
          this.AlliesNames_Table.push(event);
        } else if (type === 'delete') {
          let indexTable = this.AlliesNames_List.indexOf(event);
          this.AlliesNames_Table.splice(indexTable, 1);
        }
      })
      .catch(() => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al ${texto.error} Aliado (${event.OV_Name}), por favor intente más tarde.`
        );
      });

    this.AlliesNames_Created = this.AlliesNames_Table.length;
  }
}
