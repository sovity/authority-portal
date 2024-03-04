import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {LoadingElementModule} from '../../common/components/loading-element/loading-element.module';
import {MdsHomePageComponent} from './mds-home/mds-home.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    SharedModule,
    LoadingElementModule,
  ],
  declarations: [MdsHomePageComponent],
  exports: [MdsHomePageComponent],
})
export class MdsHomePageModule {}
