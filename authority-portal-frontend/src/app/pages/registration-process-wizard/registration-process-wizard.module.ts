import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {OrganizationCreatePageComponent} from './organization-create-page/organization-create-page.component';
import {OrganizationCreatePageStateImpl} from './organization-create-page/state/organization-create-page-state-impl';
import {OrganizationPendingPageComponent} from './organization-pending-page/organization-pending-page.component';
import {RegistrationProcessWizardComponent} from './registration-process-wizard.component';
import { OrganizationRejectedPageComponent } from './organization-rejected-page/organization-rejected-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([OrganizationCreatePageStateImpl]),

    // Authority Portal
    DevUtilsModule,
  ],
  declarations: [
    RegistrationProcessWizardComponent,
    OrganizationCreatePageComponent,
    OrganizationPendingPageComponent,
    OrganizationRejectedPageComponent,
  ],
  exports: [RegistrationProcessWizardComponent],
})
export class RegistrationProcessWizardModule {}
