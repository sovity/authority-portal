import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ImageSliderModule} from '../../common/components/image-slider/image-slider.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    ImageSliderModule,
    PortalLayoutModule,
    SharedModule,
  ],
  declarations: [DashboardPageComponent],
  exports: [DashboardPageComponent],
})
export class DashboardPageModule {}
