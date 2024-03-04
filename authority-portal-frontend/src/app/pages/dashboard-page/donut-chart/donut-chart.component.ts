import {Component, HostBinding, Input} from '@angular/core';
import {DonutChartData} from './donut-chart-data';

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
})
export class DonutChartComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-center')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  @HostBinding('style.width.px')
  width = 200;

  @Input()
  @HostBinding('style.height.px')
  height = 200;

  @Input()
  data!: DonutChartData;
}
