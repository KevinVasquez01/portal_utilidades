import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Toast } from './toast.model';
@Injectable({
  providedIn: 'root',
})
export class ToastProvider {
  list: Toast[];

  constructor() {
    this.list = [];
  }

  getMessages(): Observable<Toast[]> {
    return of(this.list);
  }

  infoMessage(message: string) {
    this.sendMessage(message, 'info');
  }

  successMessage(message: string) {
    this.sendMessage(message, 'success');
  }

  cautionMessage(message: string) {
    this.sendMessage(message, 'warning');
  }

  dangerMessage(message: string) {
    this.sendMessage(message, 'error');
  }

  sendMessage(content: string, style: string, delay: number = 7000) {
    const message = new Toast(content, style, delay);

    if(this.list.find(x=> x.content === message.content)){
      return;
    }

    this.list.push(message);

    // Remove old notifications if exeeding 6
    if (this.list.length > 6) {
      this.dismissMessage(this.list[0].timestamp);
    }
    // Remove item after it expires
    setTimeout(() => {
      this.dismissMessage(message.timestamp);
    }, delay);
  }

  dismissMessage(timestamp: Date) {
    const id = this.list.findIndex((x) => x.timestamp == timestamp);
    this.list.splice(id, 1);
  }
}
