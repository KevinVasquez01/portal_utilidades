import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { MasificationReportsDialogComponent } from '../masification-reports-dialog/masification-reports-dialog.component';

interface AlliesNames_Table {
  No: number;
  Id: string;
  Name: string;
  Editing: boolean;
}

interface AlliesNames_Top {
  Id: string;
  Name: string;
}

@Component({
  selector: 'app-allies-includes-m-top',
  templateUrl: './allies-includes-m-top.component.html',
  styleUrls: ['./allies-includes-m-top.component.scss'],
})
export class AlliesIncludesMTopComponent implements OnInit {
  AlliesNames_List: Array<AlliesNames_Top> = [];
  AlliesNames_Table: Array<AlliesNames_Table> = [];
  AlliesNames_Table_BackUp: Array<AlliesNames_Table> = [];
  isLoadingResults: boolean = true;
  LoadingResults_Errors: string[] = [];
  AlliesNames_Created: number = 0;

  eventForm: FormGroup = new FormGroup({});

  dialogRef: MatDialogRef<MasificationReportsDialogComponent> =
    Object.create(NullTemplateVisitor);

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];

  constructor(
    private _dataElementsU: DataElementsService,
    public _dialog: MatDialog,
    private _toastProvider: ToastProvider
  ) {
    this.eventForm = new FormGroup({
      Id: new FormControl(''),
      Name: new FormControl(''),
    });
  }

  async ngOnInit() {
    //Obtiene Reports_AlliesNames de UtilidadesAPI
    await this.awaitReportsAlliesIncludes();
  }

  async awaitReportsAlliesIncludes() {
    this.LoadingResults_Errors = [];
    this.AlliesNames_Table = [];
    await this._dataElementsU
      .getDdataelementU('Reports_AlliesIncludes_M_Top')
      .then(async (result) => {
        //Desde servicio Utilidades
        let results: Array<jsonDistI> = JSON.parse(result.json);
        results.sort((a, b) => a.Name.localeCompare(b.Name));
        this.AlliesNames_List = results;
        let index = 0;
        this.AlliesNames_List.forEach((x) => {
          let aName: AlliesNames_Table = {
            No: index,
            Id: x.Id,
            Name: x.Name,
            Editing: false,
          };
          this.AlliesNames_Table.push(aName);
          index++;
        });

        await this.GetDistributors();

        this.isLoadingResults = false;
      })
      .catch((error) => {
        this.LoadingResults_Errors.push(JSON.stringify(error));
      });
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
          this.listdist = distributors;
          resolve(true);
        })
        .catch(() => {
          //Lee JSON distribuidores
          this.listdist = [];
          reject();
        });
    });
  }

  deleteEvent(event: AlliesNames_Table) {
    if (event.Name === '') {
      this.AlliesNames_Table = this.AlliesNames_Table.filter((x) => x != event);
      return;
    }
    const dialog = this._dialog.open(MasificationReportsDialogComponent, {
      width: '450px',
      data: {
        titulo: `Eliminar alidado de TOP`,
        mensaje: `¿Desea eliminar el aliado: ${event.Name}?`,
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
    this.AlliesNames_Table_BackUp = this.AlliesNames_Table;
    let newAlliesNames_Table: AlliesNames_Table = {
      No: 0,
      Id: '',
      Name: '',
      Editing: true,
    };
    this.AlliesNames_Table = [newAlliesNames_Table];
    for (let i = 0; i < this.AlliesNames_Table_BackUp.length; i++) {
      this.AlliesNames_Table.push(this.AlliesNames_Table_BackUp[i]);
    }
  }

  async saveChanges(event: AlliesNames_Table, type: string) {
    let texto = {
      succes: type === 'edit' ? 'editó' : type === 'add' ? 'añadió' : 'eliminó',
      error:
        type === 'edit' ? 'editar' : type === 'add' ? 'añadir' : 'eliminar',
    };

    //Modifico aliado en Array
    let listresult = this.AlliesNames_List.filter(
      (x) => x.Name.toLocaleLowerCase() === event.Name.toLocaleLowerCase()
    );
    let result = listresult[0];
    let indexof = this.AlliesNames_List.indexOf(result);
    if (indexof < 0) {
      this.AlliesNames_List.push({
        Id: event.Id,
        Name: event.Name,
      });
    } else {
      this.AlliesNames_List[indexof] = {
        Id: event.Id,
        Name: event.Name,
      };

      if (type === 'delete') {
        this.AlliesNames_List.splice(indexof, 1);
        this.AlliesNames_Table = [];
        for (let i = 0; i < this.AlliesNames_List.length; i++) {
          this.AlliesNames_Table.push({
            No: i,
            Id: this.AlliesNames_List[i].Id,
            Name: this.AlliesNames_List[i].Name,
            Editing: false,
          });
        }
      }
    }

    await this._dataElementsU
      .updateAlliesIncludesTopMasificationDocuments(this.AlliesNames_List)
      .then(() => {
        this._toastProvider.successMessage(
          `Se ${texto.succes} Aliado (${event.Name}) con éxito.`
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
          `Ocurrió un error al ${texto.error} Aliado (${event.Name}), por favor intente más tarde.`
        );
      });

    await this.awaitReportsAlliesIncludes;

    this.AlliesNames_Created = this.AlliesNames_Table.length;
  }

  changeSelection(dato: jsonDistI, index: number) {
    this.AlliesNames_Table[index].Id = dato.Id;
    this.AlliesNames_Table[index].Name = dato.Name;
  }
}
