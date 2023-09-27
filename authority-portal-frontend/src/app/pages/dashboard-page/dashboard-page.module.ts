import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {ImageSliderModule} from '../../common/components/image-slider/image-slider.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    ImageSliderModule,
    PortalLayoutModule,
  ],
  declarations: [DashboardPageComponent],
  exports: [DashboardPageComponent],
})
export class DashboardPageModule {}
