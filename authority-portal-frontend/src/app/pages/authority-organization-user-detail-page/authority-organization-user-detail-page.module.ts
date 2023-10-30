import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityOrganizationUserDetailPageComponent} from './authority-organization-user-detail-page/authority-organization-user-detail-page.component';
import {AuthorityOrganizationUserDetailPageStateImpl} from './state/authority-organization-user-detail-page-state-impl';

@NgModule({
  declarations: [AuthorityOrganizationUserDetailPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([AuthorityOrganizationUserDetailPageStateImpl]),

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
    PipesAndDirectivesModule,
  ],
})
export class AuthorityOrganizationUserDetailPageModule {}
