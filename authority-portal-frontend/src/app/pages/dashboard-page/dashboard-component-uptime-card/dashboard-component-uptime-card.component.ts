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
import {
  ComponentStatusDto,
  UptimeStatusDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {humanizeDuration} from 'src/app/core/utils/time-utils';
import {DonutChartData} from '../donut-chart/donut-chart-data';

@Component({
  selector: 'app-dashboard-component-uptime-card',
  templateUrl: './dashboard-component-uptime-card.component.html',
})
export class DashboardComponentUptimeCardComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.items-stretch')
  @HostBinding('class.h-[20rem]')
  @HostBinding('class.border')
  @HostBinding('class.border-gray-100')
  @HostBinding('class.shadow')
  @HostBinding('class.rounded-xl')
  @HostBinding('class.p-6')
  @HostBinding('class.overflow-hidden')
  cls = true;

  @Input() label!: string;
  private _data!: Fetched<UptimeStatusDto | undefined>;
  @Input() set data(value: Fetched<UptimeStatusDto | undefined>) {
    this._data = value;
    this.chartData = value
      .mapNotNull((it) => this.buildDonutChartData(it))
      .orElse(null);
    this.upSinceHumanized = value
      .mapNotNull((it) => it.upSinceSeconds)
      .mapNotNull(humanizeDuration)
      .orElse(null);
  }
  get data(): Fetched<UptimeStatusDto | undefined> {
    return this._data;
  }
  chartData: DonutChartData | null = null;
  upSinceHumanized: string | null = null;

  humanizeDuration = humanizeDuration;

  getComponentStatusCircleClass(status: ComponentStatusDto): string {
    switch (status) {
      case ComponentStatusDto.Up:
        return 'bg-emerald-500/20';
      case ComponentStatusDto.Pending:
      case ComponentStatusDto.Maintenance:
        return 'bg-amber-500/20';
      case ComponentStatusDto.Down:
        return 'bg-red-500/20';
    }
  }

  getComponentStatusInnerCircleClass(status: ComponentStatusDto): string {
    switch (status) {
      case ComponentStatusDto.Up:
        return 'bg-emerald-500';
      case ComponentStatusDto.Pending:
      case ComponentStatusDto.Maintenance:
        return 'bg-amber-500';
      case ComponentStatusDto.Down:
        return 'bg-red-500';
    }
  }

  getComponentStatusText(status: ComponentStatusDto): string {
    switch (status) {
      case ComponentStatusDto.Up:
        return `Up ${
          this.upSinceHumanized ? 'for ' + this.upSinceHumanized : ''
        }`;
      case ComponentStatusDto.Pending:
        return 'Pending';
      case ComponentStatusDto.Maintenance:
        return 'Maintenance';
      case ComponentStatusDto.Down:
        return 'Down';
    }
  }

  buildDonutChartData(dto: UptimeStatusDto): DonutChartData {
    let timeFrameMessage = '';
    if (dto.timeSpanSeconds) {
      timeFrameMessage = ` (last ${humanizeDuration(dto.timeSpanSeconds)})`;
    }

    let upPercent = dto.uptimePercentage;
    return {
      labels: [`Online${timeFrameMessage}`, `Offline${timeFrameMessage}`],
      datasets: [
        {
          data: [upPercent, 100 - upPercent],
          backgroundColor: ['#10B981', '#EF4444'],
        },
      ],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.formattedValue} %`,
            },
          },
        },
      },
    };
  }
}
