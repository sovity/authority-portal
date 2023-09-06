import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ImageSliderModule} from '../../common/components/image-slider/image-slider.module';
import {AuthorityLayoutModule} from '../../common/layouts/authority-layout/authority-layout.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    ImageSliderModule,
    AuthorityLayoutModule,
  ],
  declarations: [DashboardPageComponent],
  exports: [DashboardPageComponent],
})
export class DashboardPageModule {}
