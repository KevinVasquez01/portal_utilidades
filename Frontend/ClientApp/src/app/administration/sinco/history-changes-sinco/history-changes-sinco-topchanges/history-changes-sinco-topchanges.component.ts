import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HistoryChangesSincoM } from '../history-changes-sinco-currentcompany/history-changes-sinco-currentcompany';
import { HistoryChangesSincoCurrentcompanyService } from '../history-changes-sinco-currentcompany/history-changes-sinco-currentcompany.service';

interface historyShow {
  company: string;
  document: string;
  user: string;
  initials: string;
  class: string;
  date: string;
}

@Component({
  selector: 'app-history-changes-sinco-topchanges',
  templateUrl: './history-changes-sinco-topchanges.component.html',
  styleUrls: ['./history-changes-sinco-topchanges.component.scss'],
})
export class HistoryChangesSincoTopchangesComponent implements OnInit {
  history_show: historyShow[] = [];
  historyDB: HistoryChangesSincoM[] = [];

  @Output() changeSelected: EventEmitter<HistoryChangesSincoM> = new EventEmitter();

  constructor(public historyService: HistoryChangesSincoCurrentcompanyService) {}

  async ngOnInit() {
    this.historyDB = await this.historyService.getHistory();
    this.historyDB.forEach((history) => {
      this.history_show.push({
        company: history.company,
        document: history.document,
        user: history.user,
        initials: history.initials,
        class: history.class,
        date: history.date.toString(),
      });
    });
  }

  onSelect(history: HistoryChangesSincoM): void {
    this.changeSelected.emit(history);
  }

}
