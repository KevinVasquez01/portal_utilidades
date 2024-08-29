import { Component } from '@angular/core';
import { SVGProvider } from '../notifications/providers/svg.provider';
import { ToastProvider } from '../notifications/toast/toast.provider';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss'],
})
export class Example1Component {
  name = 'Notifications System';

  constructor(
    private toastProvider: ToastProvider,
    public _SVGProvider: SVGProvider
  ) {}

  dismiss(id: any) {
    this.toastProvider.dismissMessage(id);
  }

  infoMessage() {
    const message = 'Info Message';
    this.toastProvider.infoMessage(message);
  }

  successMessage() {
    const message = 'Successful Message';
    this.toastProvider.successMessage(message);
  }

  cautionMessage() {
    const message = 'Warning Message';
    this.toastProvider.cautionMessage(message);
  }

  dangerMessage() {
    const message = 'Error Message';
    this.toastProvider.dangerMessage(message);
  }
}
