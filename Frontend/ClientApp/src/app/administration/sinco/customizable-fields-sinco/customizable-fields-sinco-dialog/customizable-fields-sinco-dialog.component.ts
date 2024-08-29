import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogCFS{
  tittle: string,
  image: string,
  body: string[],
  info: string
}

@Component({
  selector: 'app-customizable-fields-sinco-dialog',
  templateUrl: './customizable-fields-sinco-dialog.component.html',
  styleUrls: ['./customizable-fields-sinco-dialog.component.scss']
})
export class CustomizableFieldsSincoDialogComponent implements OnInit {

  textos: string[] = [];
  lista: {item: string, descrition: string}[] = [];

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogCFS) { }

  ngOnInit(): void {
    this.textos = this.data.body.filter(x=> !x.includes('*'));
    for(let i = 0; i< this.data.body.filter(x=> x.includes('*')).length; i++){
      let items = this.data.body.filter(x=> x.includes('*'))[i].replace('*', '').split(':');
      this.lista.push({item: items.length > 0 ? items[0] : '', descrition: items.length > 1 ? items[1] : ''});
    }
  }

  showInStackedDialog() {
    this.dialog.open(CustomizableFieldsSincoDialogComponent);
  }
}
