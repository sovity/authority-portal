import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {ParticipantRegisterOwnConnectorPageComponent} from './participant-register-own-connector-page/participant-register-own-connector-page.component';
import {ParticipantRegisterOwnConnectorPageStateImpl} from './state/participant-register-own-connector-page-state-impl';

@NgModule({
  declarations: [ParticipantRegisterOwnConnectorPageComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,

    PortalLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([ParticipantRegisterOwnConnectorPageStateImpl]),

    DevUtilsModule,
  ],
})
export class ParticipantRegisterOwnConnectorPageModule {}
