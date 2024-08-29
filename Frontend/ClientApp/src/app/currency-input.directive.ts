import { Directive, HostListener, ElementRef, OnInit, Input } from "@angular/core";
import { CurrencyPipe } from '@angular/common';

@Directive({ selector: "[currencyInput]" })
export class CurrencyInputDirective implements OnInit {

  // build the regex based on max pre decimal digits allowed
  private regexString(max?: number) {
    const maxStr = max ? `{0,${max}}` : `+`;
    return `^(\\d${maxStr}(\\.\\d{0,2})?|\\.\\d{0,2})$`
  }
  private digitRegex!: RegExp;
  private setRegex(maxDigits?: number) {
    this.digitRegex = new RegExp(this.regexString(maxDigits), 'g')
  }
  @Input() curValue:string = '';
  @Input()
  set maxDigits(maxDigits: number) {
    this.setRegex(maxDigits);
  }

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
    this.setRegex();
  }

  private default = '';

  ngOnInit() {
    this.default = this.curValue;
    this.onBlur(this.el.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value: any) {
    // on focus remove currency formatting
    this.el.value = value.replace(/[^0-9.]+/g, '');
    this.el.select();
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value: any) {
    // on blur, add currency formatting
    let currencyPipe_transform = this.currencyPipe.transform(value, 'USD');
    if(currencyPipe_transform !== null){
      this.el.value = currencyPipe_transform;
    }
    var lasttrim=this.el.value.substr(-2);
    if(lasttrim=="00"){
          this.el.value=this.el.value.substr(0,this.el.value.length-3)
    }
  }

  // variable to store last valid input
    // variable to store last valid input
  private lastValid = '';
  private saved = "";
  // history of values
  private history : any[] = [];
  @HostListener('input', ['$event'])
  onInput(event: any) {
    // on input, run regex to only allow certain characters and format
    const cleanValue = (event.target.value.match(this.digitRegex) || []).join('');
    if (cleanValue || !event.target.value){
      if(cleanValue != '' && this.history[this.history.length-1] == '' && this.saved != ""){
        this.history.push(this.saved);
        this.saved = '';
      }
      if(cleanValue == '' && this.history[this.history.length-1] != ''){
        this.history.push('');
      }
      this.lastValid = cleanValue
    }
    this.el.value = cleanValue || this.lastValid;
  }

  @HostListener("keyup.enter", ["$event.target.value"])
  onEnter(value: any) {
    this.saved = value;
  }

  @HostListener("keyup.control.z", ["$event.target.value"])
  onUndo(value : any) {
    if(this.history.length>0){
      this.lastValid = this.history.pop();
      this.el.value = this.lastValid;
    } else{
      this.lastValid = this.default;
      this.el.value = this.default;
    }
  }
}
