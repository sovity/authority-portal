import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ParticipantOwnConnectorDetailPageComponent} from './participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {ParticipantOwnConnectorDetailPageStateImpl} from './state/participant-own-connector-detail-page-state-impl';

@NgModule({
  declarations: [ParticipantOwnConnectorDetailPageComponent],
  imports: [
    CommonModule,

    // NGXS
    NgxsModule.forFeature([ParticipantOwnConnectorDetailPageStateImpl]),

    // Authority Portal
    LoadingElementModule,
    ErrorElementModule,
    MaterialModule,
    SharedModule,
  ],
  exports: [ParticipantOwnConnectorDetailPageComponent],
})
export class ParticipantOwnConnectorDetailPageModule {}
