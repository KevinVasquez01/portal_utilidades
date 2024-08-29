import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Packages, Packages_Items } from 'src/app/models/PackagesPRD/packages';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';

@Component({
  selector: 'app-companies-to-authorize-packages',
  templateUrl: './companies-to-authorize-packages.component.html',
  styleUrls: ['./companies-to-authorize-packages.component.css'],
})
export class CompaniesToAuthorizePackagesComponent
  implements OnInit, AfterViewInit
{
  packagesFE: Array<Packages_Items> = [];
  packagesDS: Array<Packages_Items> = [];
  packagesNE: Array<Packages_Items> = [];
  packagesDE: Array<Packages_Items> = [];

  selectedPackages: Packages = new Packages();

  displayedColumnsFE = ['Type', 'Name', 'actions'];
  displayedColumnsDS = ['Type', 'Name', 'actions'];
  displayedColumnsNE = ['Type', 'Name', 'actions'];
  displayedColumnsDE = ['Type', 'Name', 'actions'];

  dataSourceFE = new MatTableDataSource<Packages_Items>(this.packagesFE);
  dataSourceDS = new MatTableDataSource<Packages_Items>(this.packagesDS);
  dataSourceNE = new MatTableDataSource<Packages_Items>(this.packagesNE);
  dataSourceDE = new MatTableDataSource<Packages_Items>(this.packagesDE);

  @ViewChild(MatSort) sortFE!: MatSort;
  @ViewChild(MatSort) sortDS!: MatSort;
  @ViewChild(MatSort) sortNE!: MatSort;
  @ViewChild(MatSort) sortDE!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<Packages>,
    @Inject(MAT_DIALOG_DATA) public data: Packages,
    private _toastProvider: ToastProvider
  ) {
    this.dataSourceFE = new MatTableDataSource();
    this.dataSourceDS = new MatTableDataSource();
    this.dataSourceNE = new MatTableDataSource();
    this.dataSourceDE = new MatTableDataSource();
  }
  ngOnInit(): void {
    this.dataSourceFE.data = this.data.FE;
    this.dataSourceDS.data = this.data.DS;
    this.dataSourceNE.data = this.data.NE;
    this.dataSourceDE.data = this.data.DE;
  }

  ngAfterViewInit() {
    this.dataSourceFE.sort = this.sortFE;
    this.dataSourceDS.sort = this.sortDS;
    this.dataSourceNE.sort = this.sortNE;
    this.dataSourceDE.sort = this.sortDE;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilterFE(event: any) {
    let filterValue = event?.target?.value;
    this.dataSourceFE.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceFE.paginator) {
      this.dataSourceFE.paginator.firstPage();
    }
  }

  applyFilterDS(event: any) {
    let filterValue = event?.target?.value;
    this.dataSourceDS.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceDS.paginator) {
      this.dataSourceDS.paginator.firstPage();
    }
  }

  applyFilterNE(event: any) {
    let filterValue = event?.target?.value;
    this.dataSourceNE.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceNE.paginator) {
      this.dataSourceNE.paginator.firstPage();
    }
  }

  applyFilterDE(event: any) {
    let filterValue = event?.target?.value;
    this.dataSourceDE.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceDE.paginator) {
      this.dataSourceDE.paginator.firstPage();
    }
  }

  confirmItemFE(event: Packages_Items) {
    if (this.selectedPackages.FE.indexOf(event) == -1) {
      //Elimina item de por confirmar
      let index = this.data.FE.indexOf(event);
      this.data.FE.splice(index, 1);

      //Agrega item a lista de confirmados
      this.selectedPackages.FE.push(event);
      this._toastProvider.successMessage('Se agregó plan o paquete de FE');
    }
  }

  confirmItemDS(event: Packages_Items) {
    if (this.selectedPackages.DS.indexOf(event) == -1) {
      //Elimina item de por confirmar
      let index = this.data.DS.indexOf(event);
      this.data.DS.splice(index, 1);

      //Agrega item a lista de confirmados
      this.selectedPackages.DS.push(event);
      this._toastProvider.successMessage('Se agregó plan o paquete de DS');
    }
  }

  confirmItemNE(event: Packages_Items) {
    if (this.selectedPackages.NE.indexOf(event) == -1) {
      //Elimina item de por confirmar
      let index = this.data.NE.indexOf(event);
      this.data.NE.splice(index, 1);

      //Agrega item a lista de confirmados
      this.selectedPackages.NE.push(event);
      this._toastProvider.successMessage('Se agregó plan o paquete de NE');
    }
  }

  confirmItemDE(event: Packages_Items) {
    if (this.selectedPackages.DE.indexOf(event) == -1) {
      //Elimina item de por confirmar
      let index = this.data.DE.indexOf(event);
      this.data.DE.splice(index, 1);

      //Agrega item a lista de confirmados
      this.selectedPackages.DE.push(event);
      this._toastProvider.successMessage('Se agregó plan o paquete de DE');
    }
  }
}
