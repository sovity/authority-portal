import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {ImageSliderModule} from '../../common/components/image-slider/image-slider.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    ImageSliderModule,
    SharedModule,
  ],
  declarations: [DashboardPageComponent],
  exports: [DashboardPageComponent],
})
export class DashboardPageModule {}
