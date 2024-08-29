import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogI } from 'src/app/models/dialog.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: []
})
export class CompanyDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogI) {}

  ngOnInit() {
  }

  aceptar() {
    this.data.respuesta = true;
  }

  cancelar() {
    this.data.respuesta = false;
  }
}
