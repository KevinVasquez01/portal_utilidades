import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { homeDataElements } from 'src/app/models/HomeDataElements/home-data-elements';

@Component({
  selector: 'app-admin-home-buttons-dialog',
  templateUrl: './admin-home-buttons-dialog.component.html',
  styleUrls: ['./admin-home-buttons-dialog.component.scss']
})
export class AdminHomeButtonsDialogComponent {
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<AdminHomeButtonsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: homeDataElements,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
