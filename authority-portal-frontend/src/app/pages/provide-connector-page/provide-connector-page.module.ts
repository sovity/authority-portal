import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ProvideConnectorPageComponent} from './provide-connector-page/provide-connector-page.component';
import {ProvideConnectorPageStateImpl} from './state/provide-connector-page-state-impl';

@NgModule({
  declarations: [ProvideConnectorPageComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,

    PortalLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([ProvideConnectorPageStateImpl]),

    DevUtilsModule,
    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
  ],
})
export class ProvideConnectorPageModule {}
