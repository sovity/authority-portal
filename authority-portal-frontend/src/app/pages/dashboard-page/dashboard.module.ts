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
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgChartsModule} from 'ng2-charts';
import {SharedModule} from 'src/app/shared/shared.module';
import {DashboardComponentUptimeCardComponent} from './dashboard-component-uptime-card/dashboard-component-uptime-card.component';
import {DashboardConnectorCardComponent} from './dashboard-connector-card/dashboard-connector-card.component';
import {DashboardCsvReportsCardComponent} from './dashboard-csv-reports-card/dashboard-csv-reports-card.component';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {DonutChartComponent} from './donut-chart/donut-chart.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    SharedModule,

    // Third party
    NgChartsModule,
  ],
  declarations: [
    DashboardPageComponent,
    DonutChartComponent,
    DashboardComponentUptimeCardComponent,
    DashboardConnectorCardComponent,
    DashboardCsvReportsCardComponent,
  ],
  exports: [DashboardPageComponent],
})
export class DashboardPageModule {}
