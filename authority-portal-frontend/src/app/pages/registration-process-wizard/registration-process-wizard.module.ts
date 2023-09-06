import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputModule} from '../../common/components/input/input.module';
import {OrganisationCreatePageComponent} from './organisation-create-page/organisation-create-page.component';
import {OrganizationPendingPageComponent} from './organization-pending-page/organization-pending-page.component';
import {RegistrationProcessWizardComponent} from './registration-process-wizard.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    // Authority Portal
    InputModule,
  ],
  declarations: [
    RegistrationProcessWizardComponent,
    OrganisationCreatePageComponent,
    OrganizationPendingPageComponent,
  ],
  exports: [RegistrationProcessWizardComponent],
})
export class RegistrationProcessWizardModule {}
