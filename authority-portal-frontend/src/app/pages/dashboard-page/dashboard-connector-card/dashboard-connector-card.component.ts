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
import {Fetched} from 'src/app/core/utils/fetched';
import {DonutChartData} from '../donut-chart/donut-chart-data';

export interface ConnectorData {
  numOnline: number;
  numDisturbed: number;
  numOffline: number;
}

export interface ConnectorKpi {
  label: string;
  classLed: string;
  classLedShadow: string;
  chartColor: string;
  kpi: (dto: ConnectorData) => number;
}

@Component({
  selector: 'app-dashboard-connector-card',
  templateUrl: './dashboard-connector-card.component.html',
})
export class DashboardConnectorCardComponent {
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
  @HostBinding()
  cls = true;

  allKpis: ConnectorKpi[] = [
    {
      label: 'Online',
      classLed: 'bg-emerald-500',
      classLedShadow: 'bg-emerald-500/20',
      chartColor: '#10B981',
      kpi: (dto) => dto.numOnline,
    },
    {
      label: 'Disturbed',
      classLed: 'bg-amber-500',
      classLedShadow: 'bg-amber-500/20',
      chartColor: '#F59E0B',
      kpi: (dto) => dto.numDisturbed,
    },
    {
      label: 'Offline',
      classLed: 'bg-red-500',
      classLedShadow: 'bg-red-500/20',
      chartColor: '#EF4444',
      kpi: (dto) => dto.numOffline,
    },
  ];

  visibleKpis: ConnectorKpi[] = [];

  private _data!: Fetched<ConnectorData>;
  @Input() set data(value: Fetched<ConnectorData>) {
    this._data = value;
    this.visibleKpis = value
      .map((it) => this.allKpis.filter((kp) => kp.kpi(it) > 0))
      .orElse([]);
    this.chartData = value
      .map((it) => this.buildDonutChartData(it, this.visibleKpis))
      .orElse(null);
  }

  get data(): Fetched<ConnectorData> {
    return this._data;
  }

  chartData: DonutChartData | null = null;

  buildDonutChartData(
    dto: ConnectorData,
    kpis: ConnectorKpi[],
  ): DonutChartData | null {
    if (!kpis?.length) {
      return null;
    }

    return {
      labels: kpis.map((it) => it.label),
      datasets: [
        {
          data: kpis.map((it) => it.kpi(dto)),
          backgroundColor: kpis.map((it) => it.chartColor),
        },
      ],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.formattedValue} Connectors`,
            },
          },
        },
      },
    };
  }
}
