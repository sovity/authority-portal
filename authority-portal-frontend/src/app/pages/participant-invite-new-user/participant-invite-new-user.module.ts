import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {ParticipantInviteNewUserComponent} from './participant-invite-new-user/participant-invite-new-user.component';
import {ParticipantInviteNewUserPageStateImpl} from './state/participant-invite-new-user-page-state-impl';

@NgModule({
  declarations: [ParticipantInviteNewUserComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([ParticipantInviteNewUserPageStateImpl]),
  ],
})
export class ParticipantInviteNewUserModule {}
