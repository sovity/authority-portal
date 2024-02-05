import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormElementsModule} from '../../common/components/form-elements/form-elements.module';
import {
  ParticipantRegisterOwnConnectorPageComponent
} from './participant-register-own-connector-page/participant-register-own-connector-page.component';
import {ParticipantRegisterOwnConnectorPageStateImpl} from './state/participant-register-own-connector-page-state-impl';
import {RegisterConnectorPageComponent} from './sub-pages/register-connector-page/register-connector-page.component';
import {RequestConnectorPageComponent} from './sub-pages/request-connector-page/request-connector-page.component';
import {SetupConnectorPageComponent} from './sub-pages/setup-connector-page/setup-connector-page.component';

@NgModule({
  declarations: [
    ParticipantRegisterOwnConnectorPageComponent,
    SetupConnectorPageComponent,
    RequestConnectorPageComponent,
    RegisterConnectorPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,

    PortalLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([ParticipantRegisterOwnConnectorPageStateImpl]),

    FormElementsModule,
    LoadingElementModule,
    DevUtilsModule,
    MaterialModule,
    SharedModule,
  ],
})
export class ParticipantRegisterOwnConnectorPageModule {}
