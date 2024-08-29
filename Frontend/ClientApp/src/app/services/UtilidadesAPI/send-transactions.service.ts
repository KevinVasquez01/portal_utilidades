import { Injectable } from '@angular/core';
import { TransactionsUI } from 'src/app/models/Transactions-utilities/transaction';
import { UtilidadesAPIService } from './utilidades-api.service';

@Injectable({
  providedIn: 'root'
})
export class SendTransactionsService {

  constructor(private _UtilAPI: UtilidadesAPIService) { }

  enviarTransaccion(documentType: string, documentNumber: string, transactionType: number, description: string) {
    return new Promise((resolve, reject) => {
      let document = `${documentType}_${documentNumber}`;
      let transaction: TransactionsUI = {
        company_document: document,
        date: new Date(),
        user: localStorage.getItem('user') == null ? 'invitado' : localStorage.getItem('user') || '',
        transaction_type: transactionType,
        description: description
      };

      this._UtilAPI.NewTransaction(transaction).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
