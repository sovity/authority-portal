import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormElementsModule} from '../../common/components/form-elements/form-elements.module';
import {ChooseParticipantConnectorComponent} from './choose-participant-connector/choose-participant-connector.component';

@NgModule({
  declarations: [ChooseParticipantConnectorComponent],
  exports: [ChooseParticipantConnectorComponent],
  imports: [
    BrowserModule,
    CommonModule,
    DevUtilsModule,
    FormElementsModule,
    FormsModule,
    LoadingElementModule,
    MaterialModule,

    PipesAndDirectivesModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
})
export class ChooseParticipantConnectorModule {}