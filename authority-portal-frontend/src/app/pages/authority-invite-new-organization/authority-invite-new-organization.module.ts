import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {AuthorityInviteNewOrganizationComponent} from 'src/app/pages/authority-invite-new-organization/authority-invite-new-organization/authority-invite-new-organization.component';
import {AuthorityInviteNewOrganizationPageStateImpl} from 'src/app/pages/authority-invite-new-organization/state/authority-invite-new-organization-page-state-impl';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AuthorityInviteNewOrganizationComponent],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // NGXS
    NgxsFormPluginModule,
    NgxsModule.forFeature([AuthorityInviteNewOrganizationPageStateImpl]),

    // Angular Material
    MaterialModule,

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class AuthorityInviteNewOrganizationModule {}
