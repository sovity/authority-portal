import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormElementsModule} from '../../../common/components/form-elements/form-elements.module';
import {OrganizationOnboardPageComponent} from './organization-onboard-page/organization-onboard-page.component';
import {OrganizationOnboardPageStateImpl} from './state/organization-onboard-page-state-impl';

@NgModule({
  declarations: [OrganizationOnboardPageComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // NGXS
    NgxsModule.forFeature([OrganizationOnboardPageStateImpl]),

    // Authority Portal
    DevUtilsModule,
    FormElementsModule,
    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
  ],
  exports: [OrganizationOnboardPageComponent],
})
export class OrganizationOnboardPageModule {}
