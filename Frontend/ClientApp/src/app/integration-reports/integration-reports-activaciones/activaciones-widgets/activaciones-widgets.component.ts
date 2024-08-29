import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface WD_struct {
  name: string;
  value: number;
}

interface widget {
  tittle: string;
  text1: string;
  text2: string;
}

@Component({
  selector: 'app-activaciones-widgets',
  templateUrl: './activaciones-widgets.component.html',
  styleUrls: ['./activaciones-widgets.component.scss'],
})
export class ActivacionesWidgetsComponent implements OnInit {
  @Input() report_type: number = 1; //1 FE, 2 NE, 3 DS, 4 RE, 5 DE

  @Input() total_companies_SalesForce: number = 0;
  @Input() company_count: WD_struct[] = [];
  @Input() company_money: WD_struct[] = [];
  @Input() report_history: { last: string; now: string; value: string } = {
    last: '',
    now: '',
    value: '',
  };

  //Si se está viendo un histórico
  @Input() isHistory: boolean = false;
  @Input() user: string = '';

  //Widgets Content
  w1: widget = {
    tittle: '',
    text1: '',
    text2: '',
  };
  w2: widget = {
    tittle: '',
    text1: '',
    text2: '',
  };
  w3: widget = {
    tittle: '',
    text1: '',
    text2: '',
  };
  w4: widget = {
    tittle: '',
    text1: '',
    text2: '',
  };

  //layouts
  layouts_totalEmpresas = 50;
  layouts_dineroEmpresas = 50;
  module_fulllayout = '';

  change_layouts(module: string) {
    if (module === 'totalEmpresas') {
      if (this.module_fulllayout === 'totalEmpresas') {
        this.layouts_totalEmpresas = 50;
        this.layouts_dineroEmpresas = 50;
        this.module_fulllayout = '';
      } else {
        this.layouts_totalEmpresas = 100;
        this.layouts_dineroEmpresas = 0;
        this.module_fulllayout = module;
      }
    } else if (module === 'dineroEmpresas') {
      if (this.module_fulllayout === 'dineroEmpresas') {
        this.layouts_totalEmpresas = 50;
        this.layouts_dineroEmpresas = 50;
        this.module_fulllayout = '';
      } else {
        this.layouts_totalEmpresas = 0;
        this.layouts_dineroEmpresas = 100;
        this.module_fulllayout = module;
      }
    }
  }

  myYAxisTickFormatting(val: number) {
    return '$' + val;
  }

  constructor(private currencyPipe: CurrencyPipe) {
  }

  async ngOnInit() {
    //Ordena de mayor a menor
    this.company_count.sort(function(a, b){return b.value-a.value});
    this.company_money.sort(function(a, b){return b.value-a.value});

    //company_money
    let totalMoney = 0;
    await Promise.all(
      this.company_money.map(async (company) => {
        totalMoney = Number(totalMoney) + Number(company.value);
      })
    );

    let currencyPipe_transform = this.currencyPipe.transform(totalMoney, 'USD');
    if (currencyPipe_transform !== null) {
      this.w4.tittle = currencyPipe_transform;
    }
    var lasttrim = this.w4.tittle.substr(-2);
    if (lasttrim == '00') {
      this.w4.tittle = this.w4.tittle.substr(0, this.w4.tittle.length - 3);
    }

    //company_count
    await Promise.all(
      this.company_count.map(async (company) => {
        this.w3.tittle = (
          Number(this.w3.tittle) + Number(company.value)
        ).toString();
      })
    );

    this.assemble_widgets();
  }

  assemble_widgets() {
    this.w1 = {
      tittle: this.report_history.value,
      text1: this.report_history.now,
      text2: this.report_history.last,
    };

    this.w2 = {
      tittle: this.isHistory
        ? this.user
        : this.total_companies_SalesForce.toString(),
      text1: this.isHistory ? 'Usuario que generó' : 'Total Empresas',
      text2: this.isHistory ? 'informe' : 'Salesforce',
    };

    this.w3.text1 = 'Nuevas empresas';
    this.w4.text1 = 'Dinero Nuevas';

    //Invoice
    if (this.report_type == 1) {
      this.w3.text2 = 'activas FE';
      this.w4.text2 = 'empresas FE';
      this.w2.text2 = 'Salesforce FE';

      this.labelCompaniesTotal = 'Nuevas empresas FE';
    }
    //Payroll
    else if (this.report_type == 2) {
      this.w3.text2 = 'activas NE';
      this.w4.text2 = 'empresas NE';
      this.w2.text2 = 'Salesforce NE';

      this.labelCompaniesTotal = 'Nuevas empresas NE';
    }
    //DocumentSupport
    else if (this.report_type == 3) {
      this.w3.text2 = 'activas DS';
      this.w4.text2 = 'empresas DS';
      this.w2.text2 = 'Salesforce DS';

      this.labelCompaniesTotal = 'Nuevas empresas DS';
    }
    //Receotion
    else if (this.report_type == 4) {
      this.w3.text2 = 'activas RE';
      this.w4.text2 = 'empresas RE';
      this.w2.text2 = 'Salesforce RE';

      this.labelCompaniesTotal = 'Nuevas empresas RE';
    }
     //EquivalentDocument
     else if (this.report_type == 5) {
      this.w3.text2 = 'activas DE';
      this.w4.text2 = 'empresas DE';
      this.w2.text2 = 'Salesforce DE';

      this.labelCompaniesTotal = 'Nuevas empresas DE';
    }
  }

  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  tooltipDisabled = false;
  labelCompaniesTotal = 'Nuevas empresas';
  xAxisLabel = 'Operadores Virtuales';
  showYAxisLabel = true;
  yAxisLabel = 'Dinero Activaciones';
  showGridLines = true;
  innerPadding = 0;
  autoScale = true;
  timeline = false;
  barPadding = 8;
  groupPadding = 0;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showLabels = true;
  explodeSlices = false;
  doughnut = true; //*
  arcWidth = 0.25;
  rangeFillOpacity = 0.15;

  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);

  yAxisTickFormatting(value: any) {
    try {
      let nuevonumero = Number(value).toLocaleString('es-CO');
      return '$' + nuevonumero;
    } catch {
      return '$' + value;
    }
  }

  colorScheme = {
    domain: [
      '#4fc3f7',
      '#fb8c00',
      '#7460ee',
      '#f62d51',
      '#20c997',
      '#2962FF',
      '#49be25',
      '#9925be',
      '#96be25',
      '#6c25be',
    ],
  };
  schemeType = 'ordinal';
}
