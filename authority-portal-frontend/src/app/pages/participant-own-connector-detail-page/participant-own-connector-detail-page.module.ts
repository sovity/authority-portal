import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {ParticipantOwnConnectorDetailPageComponent} from './participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {ParticipantOwnConnectorDetailPageStateImpl} from './state/participant-own-connector-detail-page-state-impl';

@NgModule({
  declarations: [ParticipantOwnConnectorDetailPageComponent],
  imports: [
    CommonModule,

    // NGXS
    NgxsModule.forFeature([ParticipantOwnConnectorDetailPageStateImpl]),

    // Authority Portal
    PortalLayoutModule,
  ],
})
export class ParticipantOwnConnectorDetailPageModule {}
