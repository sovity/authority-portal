import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {RegistrationProcessWizardComponent} from './registration-process-wizard/registration-process-wizard.component';
import {OrganizationCreatePageStateImpl} from './state/organization-create-page-state-impl';
import {OrganizationCreatePageComponent} from './sub-pages/organization-create-page/organization-create-page.component';
import {OrganizationPendingPageComponent} from './sub-pages/organization-pending-page/organization-pending-page.component';
import {OrganizationRejectedPageComponent} from './sub-pages/organization-rejected-page/organization-rejected-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([OrganizationCreatePageStateImpl]),

    // Authority Portal
    DevUtilsModule,
    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
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
