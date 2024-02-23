import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormElementsModule} from '../../../common/components/form-elements/form-elements.module';
import {RegisterConnectorPageComponent} from './register-connector-page/register-connector-page.component';
import {RegisterConnectorPageStateImpl} from './state/register-connector-page-state-impl';

@NgModule({
  declarations: [RegisterConnectorPageComponent],
  exports: [RegisterConnectorPageComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,

    FormsModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([RegisterConnectorPageStateImpl]),

    DevUtilsModule,
    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
    FormElementsModule,
  ],
})
export class RegisterConnectorPageModule {}
