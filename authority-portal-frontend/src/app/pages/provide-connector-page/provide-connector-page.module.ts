import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {FormElementsModule} from '../../common/components/form-elements/form-elements.module';
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

    FormElementsModule,
    DevUtilsModule,
  ],
})
export class ProvideConnectorPageModule {}
