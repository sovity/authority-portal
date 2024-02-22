import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {SpConnectorDetailPageComponent} from './sp-connector-detail-page/sp-connector-detail-page.component';
import {SpConnectorDetailPageStateImpl} from './state/sp-connector-detail-page-state-impl';

@NgModule({
  declarations: [SpConnectorDetailPageComponent],
  imports: [
    CommonModule,

    // NGXS
    NgxsModule.forFeature([SpConnectorDetailPageStateImpl]),

    // Authority Portal
    LoadingElementModule,
    ErrorElementModule,
    MaterialModule,
    SharedModule,
  ],
})
export class SpConnectorDetailPageModule {}
