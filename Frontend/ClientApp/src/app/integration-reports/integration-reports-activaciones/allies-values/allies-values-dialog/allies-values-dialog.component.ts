import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlliesNames } from 'src/app/models/Reports/allies-names';

interface DialogI_1 {
  titulo: string;
  respuesta: AlliesNames;
}

@Component({
  selector: 'app-allies-values-dialog',
  templateUrl: './allies-values-dialog.component.html',
  styleUrls: ['./allies-values-dialog.component.scss']
})
export class AlliesValuesDialogComponent {
  eventForm: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<AlliesValuesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogI_1,
    private formBuilder: FormBuilder
  ) {
    this.eventForm = new FormGroup({
      OV_Name: new FormControl(''),
      PayRoll_Activation_Value: new FormControl('', Validators.pattern("^[0-9]*$")),
      Invoice_Activation_Value: new FormControl('', Validators.pattern("^[0-9]*$")),
      Support_Document_Value: new FormControl('', Validators.pattern("^[0-9]*$")),
      Reception_Activation_Value: new FormControl('', Validators.pattern("^[0-9]*$")),
      Equivalent_Document_Value: new FormControl('', Validators.pattern("^[0-9]*$")),
    });
  }
}
