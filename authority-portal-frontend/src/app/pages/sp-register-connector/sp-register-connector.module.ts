import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {SpRegisterConnectorPageComponent} from './sp-register-connector/sp-register-connector-page.component';
import {SpRegisterConnectorPageStateImpl} from './state/sp-register-connector-page-state-impl';

@NgModule({
  declarations: [SpRegisterConnectorPageComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,

    PortalLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([SpRegisterConnectorPageStateImpl]),
  ],
})
export class SpRegisterConnectorModule {}
