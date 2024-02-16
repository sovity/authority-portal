import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {FormElementsModule} from 'src/app/common/components/form-elements/form-elements.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityInviteNewOrganizationComponent} from './authority-invite-new-organization/authority-invite-new-organization.component';
import {AuthorityInviteNewOrganizationPageStateImpl} from './state/authority-invite-new-organization-page-state-impl';

@NgModule({
  declarations: [AuthorityInviteNewOrganizationComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([AuthorityInviteNewOrganizationPageStateImpl]),

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    MaterialModule,
    LoadingElementModule,
    ErrorElementModule,
    PipesAndDirectivesModule,
    FormElementsModule,
  ],
  exports: [AuthorityInviteNewOrganizationComponent],
})
export class AuthorityInviteNewOrganizationModule {}
