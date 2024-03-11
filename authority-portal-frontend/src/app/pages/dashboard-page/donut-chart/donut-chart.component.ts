/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
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
