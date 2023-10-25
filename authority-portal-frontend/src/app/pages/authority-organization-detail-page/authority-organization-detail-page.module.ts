import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityOrganizationDetailPageComponent} from './authority-organization-detail-page/authority-organization-detail-page.component';
import {AuthorityOrganizationDetailPageStateImpl} from './state/authority-organization-detail-page-state-impl';

@NgModule({
  declarations: [AuthorityOrganizationDetailPageComponent],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // Angular Material
    MaterialModule,

    // NGXS
    NgxsModule.forFeature([AuthorityOrganizationDetailPageStateImpl]),

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class AuthorityOrganizationDetailPageModule {}
