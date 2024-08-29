import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { HistoryChangesSincoNewChangeComponent } from '../history-changes-sinco-new-change/history-changes-sinco-new-change.component';
import {
  HistoryChangesSincoM,
  HistoryChangesSincoDB,
} from './history-changes-sinco-currentcompany';
import { HistoryChangesSincoCurrentcompanyService } from './history-changes-sinco-currentcompany.service';

@Component({
  selector: 'app-history-changes-sinco-currentcompany',
  templateUrl: './history-changes-sinco-currentcompany.component.html',
  styleUrls: ['./history-changes-sinco-currentcompany.component.scss'],
})
export class HistoryChangesSincoCurrentcompanyComponent implements OnInit {
  sidePanelOpened = true;

  @Input() companyName: string = '';
  @Input() companyDocument: string = '';
  @Input() companyDV: string = '';

  tittle = '';

  //temp
  dataSource = [''];
  displayedColumns: string[] = ['itemName', 'unitPrice', 'unit', 'total'];

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  history_show: HistoryChangesSincoM[] = [];
  selectedHistory: HistoryChangesSincoM = Object.create(null);
  searchText = '';
  newChange = false;
  constructor(
    private _historyService: HistoryChangesSincoCurrentcompanyService,
    private _dialog: MatDialog,
    private _toastProvider: ToastProvider
  ) {}

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  async ngOnInit() {
    this.tittle = `${this.companyName} (${this.companyDocument}${
      this.companyDV != '' ? '-' + this.companyDV : ''
    })`;
    if (this.companyDocument != '') {
      this.history_show = await this._historyService.getHistoryCompany(
        this.companyDocument
      );
      this.onLoad();
    }
  }
  onLoad(): void {
    if (this.history_show.length > 0) {
      this.selectedHistory = this.history_show[0];
    }
  }
  onSelect(history: HistoryChangesSincoM): void {
    this.selectedHistory = history;
  }

  addChangeClick(): void {
    const dialog = this._dialog.open(HistoryChangesSincoNewChangeComponent, {
      width: '100%',
      height: 'auto',
      data: {
        titulo: `Registrar cambio`,
        mensaje: this.tittle,
        respuesta: false,
        change: '',
      },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.addChange(JSON.parse(result.change));
      }
    });
  }

  closeClick(): void {
    this.close.emit(true);
  }

  async addChange(newChange: HistoryChangesSincoDB) {
    let user = localStorage.getItem('user') + '';
    newChange.user_creator = user;
    newChange.company_name = this.companyName;
    newChange.document_number = this.companyDocument.trim();
    newChange.dv = this.companyDV.trim();

    this._historyService
      .NewHistoryChangesSinco(newChange)
      .then(async () => {
        this._toastProvider.successMessage('Se guardó Cambio con éxito');
        this.history_show = await this._historyService.getHistoryCompany(
          this.companyDocument
        );
        this.onLoad();
      })
      .catch((error) => {
        this._toastProvider.successMessage(`Ocurrió un error al intentar guardar los cambios: ${JSON.stringify(error)}`);
      });
  }
}
