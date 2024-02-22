import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ParticipantUserDetailPageComponent} from './participant-user-detail-page/participant-user-detail-page.component';
import {ParticipantUserDetailPageStateImpl} from './state/participant-user-detail-page-state-impl';

@NgModule({
  declarations: [ParticipantUserDetailPageComponent],
  imports: [
    CommonModule,

    // NGXS
    NgxsModule.forFeature([ParticipantUserDetailPageStateImpl]),

    // Authority Portal
    SharedModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class ParticipantUserDetailPageModule {}
