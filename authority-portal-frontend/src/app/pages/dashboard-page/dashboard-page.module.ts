import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    SharedModule,
  ],
  declarations: [DashboardPageComponent],
  exports: [DashboardPageComponent],
})
export class DashboardPageModule {}
