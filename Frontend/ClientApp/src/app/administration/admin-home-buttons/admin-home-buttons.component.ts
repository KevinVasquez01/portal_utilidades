import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { homeDataElements } from 'src/app/models/HomeDataElements/home-data-elements';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';
import { AdminHomeButtonsDeleteComponent } from './admin-home-buttons-delete/admin-home-buttons-delete.component';
import { AdminHomeButtonsDialogComponent } from './admin-home-buttons-dialog/admin-home-buttons-dialog.component';
import { AdminHomeButtonsOkComponent } from './admin-home-buttons-ok/admin-home-buttons-ok.component';

@Component({
  selector: 'app-admin-home-buttons',
  templateUrl: './admin-home-buttons.component.html',
  styleUrls: ['./admin-home-buttons.component.scss'],
})
export class AdminHomeButtonsComponent implements OnInit {
  todos: homeDataElements[] = [];

  constructor(
    public dialog: MatDialog,
    private _dataElementsU: DataElementsService,
    private _toastProvider: ToastProvider,
    private _userMovement: UserMovementsService
  ) {}
  ngOnInit(): void {
    this.getDataElements();
  }

  goToLink(url: string | undefined) {
    if (url !== undefined) {
      window.open(url, '_blank');
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AdminHomeButtonsDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addTask(result.data);
      }
      if (result.event === 'Edit') {
        this.editTask(result.data);
      }
    });
  }

  async addTask(row_obj: homeDataElements) {
    this.todos.push({
      id: this.todos.length + 1,
      faIcon: row_obj.faIcon,
      tittle: row_obj.tittle,
      text: row_obj.text,
      url: row_obj.url,
    });
    //Enviar transaccion crear
    await this.sendDataElements(row_obj, 0).then(() => {
      this._userMovement.NewUsersMovement(
        `Crear botón de Inicio: ${row_obj.tittle}`
      );
    });
    this.dialog.open(AdminHomeButtonsOkComponent);
  }

  async editTask(row_obj: homeDataElements) {
    this.todos = this.todos.filter((value: homeDataElements) => {
      if (value.id === row_obj.id) {
        value.faIcon = row_obj.faIcon;
        value.tittle = row_obj.tittle;
        value.text = row_obj.text;
        value.url = row_obj.url;
      }
      return true;
    });
    //Enviar transaccion editar
    await this.sendDataElements(row_obj, 1).then(() => {
      this._userMovement.NewUsersMovement(
        `Editar botón de Inicio: ${row_obj.tittle}`
      );
    });
  }

  async deleteTask(t: homeDataElements) {
    const del = this.dialog.open(AdminHomeButtonsDeleteComponent);

    del.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        this.todos = this.todos.filter((task) => task.id !== t.id);
        for (let i = 0; i < this.todos.length; i++) {
          this.todos[i].id = i + 1;
        }

        //Enviar transaccion eliminar
        await this.sendDataElements(t, 2).then(() => {
          this._userMovement.NewUsersMovement(
            `Eliminar botón de Inicio: ${t.tittle}`
          );
        });
      }
    });
  }

  async sendDataElements(t: homeDataElements, action: number) {
    await this._dataElementsU
      .updateHomeDataElements(this.todos)
      .then(() => {
        this._toastProvider.successMessage(
          `Se ${
            action === 0 ? 'Creó' : action === 1 ? 'Editó' : 'Eliminó'
          } botón ${t.tittle} con éxito.`
        );
      })
      .catch(() => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al ${
            action === 0 ? 'Crear' : action === 1 ? 'Editar' : 'Eliminar'
          } botón ${t.tittle}, por favor intente más tarde.`
        );
      });
  }

  async getDataElements() {
    await this._dataElementsU
      .getHomeDataElements()
      .then((data) => {
        this.todos = JSON.parse(data['json']);
      })
      .catch(() => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al obtener botones, por favor intente más tarde.`
        );
      });
  }
}
