import { Component, OnInit } from '@angular/core';
import { ToastProvider } from './toast.provider';
import { SVGProvider } from '../providers/svg.provider';
import { Toast } from './toast.model';

@Component({
  selector: 'toast-messages',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  messages: any;
  toast: Toast[] = [];

  constructor(
    private toastProvider: ToastProvider,
    public _SVGProvider: SVGProvider
  ) {}

  ngOnInit() {
    this.messages = this.toastProvider.getMessages();
  }

  dismiss(id: any) {
    this.toastProvider.dismissMessage(id);
  }

  icon(style: string){
    if(style === 'info'){
      return 'notification_important'
    }
    else if(style === 'warning'){
      return 'warning'
    }
    else if(style === 'error'){
      return 'error'
    }
    else if(style === 'success'){
      return 'thumb_up'
    }
    return 'thumb_up';
  }
}
