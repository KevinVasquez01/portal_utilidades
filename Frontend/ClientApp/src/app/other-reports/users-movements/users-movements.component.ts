import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExportService } from 'src/app/services/export.service';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';
import { UtilidadesAPIService } from 'src/app/services/UtilidadesAPI/utilidades-api.service';
import { MenuItems } from 'src/app/shared/menu-items/menu-items';
import { UsersMovements, UsersMovements_Excel } from './users-movements';

interface profiles {
  user: string;
  profile: string;
}

interface profiles {
  user: string;
  profile: string;
}

@Component({
  selector: 'app-users-movements',
  templateUrl: './users-movements.component.html',
  styleUrls: ['./users-movements.component.scss'],
})
export class UsersMovementsComponent implements OnInit {
  Movements: UsersMovements_Excel[] = [];
  Profiles: profiles[] = [];
  NameExcel = ''
  date = new FormControl('');

  generado = false;

  constructor(
    private _userMovement: UserMovementsService,
    private _UAPI: UtilidadesAPIService,
    public _menuItems: MenuItems,
    private _export: ExportService,
    private _datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.GetProfiles().then((result) => {
      this.Profiles = JSON.parse(JSON.stringify(result));
    });
  }

  GetProfiles() {
    return new Promise((resolve, reject) => {
      this._UAPI.Profiles().subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  close(){
    this.generado = false;
    this.Movements = []
  }

  async usersMovements() {
    let datefrom = this.date.value;
    if(datefrom === ''){
      let date2months = new Date();
      date2months.setMonth(date2months.getMonth()-2);
      datefrom = this._datePipe.transform(date2months, 'yyyy-MM-dd');
    }
    let date = this._datePipe.transform(this.date.value, 'yyyy-MM-dd') || '';
    let today = this._datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    this.NameExcel = `MovimientosUsuarios_${date}_${today}`;
    await this._userMovement.ListUsersMovement(date)
    .then((data) => {
      this.Movements = [];
      let UMovements: UsersMovements[] = JSON.parse(JSON.stringify(data));
      for (let i = 0; i < UMovements.length; i++) {
        this.Movements.push({
          Fecha: UMovements[i].date,
          Usuario: UMovements[i].user,
          Perfil: this.searchProfile(UMovements[i].user),
          Componente: this.searchComponent(UMovements[i].component),
          Descripcion: UMovements[i].description,
          Ambiente: UMovements[i].ambient,
        });
      }
      this.generado = true;
    });
  }

  searchProfile(user: string) {
    let result = this.Profiles.find((x) => x.user == user);
    if (result === undefined) {
      return 'guest';
    } else {
      return result.profile;
    }
  }

  searchComponent(component: string){
    let split = component.split('/');
    let menu = this._menuItems.getMenuitem();
    let name = '';

    if(split.length > 0){
      let result = menu.find(x=> x.state == split[0]);
        if(result != undefined){
          name+= result?.name;
          if(split.length > 1){
            let children = result?.children?.find(x=> x.state == split[1]);
            name+= children === undefined ? '': ` / ${children.name}`;
            if(split.length > 2){
              let subchildren = children?.subchildren?.find(x=> x.state == split[2]);
              name+= subchildren === undefined ? '': ` / ${subchildren.name}`;
            }
          }
        }
        else{
          return component;
        }
    }
    return name;
  }
}

