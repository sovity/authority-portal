import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgChartsModule} from 'ng2-charts';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
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
    MaterialModule,

    // Authority Portal
    LoadingElementModule,
    ErrorElementModule,
    SharedModule,
    PipesAndDirectivesModule,

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
