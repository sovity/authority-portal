import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {FormElementsModule} from 'src/app/common/components/form-elements/form-elements.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ParticipantInviteNewUserComponent} from './participant-invite-new-user/participant-invite-new-user.component';
import {ParticipantInviteNewUserPageStateImpl} from './state/participant-invite-new-user-page-state-impl';

@NgModule({
  declarations: [ParticipantInviteNewUserComponent],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([ParticipantInviteNewUserPageStateImpl]),

    // Angular Material
    MaterialModule,

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
    PipesAndDirectivesModule,
    FormElementsModule,
  ],
})
export class ParticipantInviteNewUserModule {}
