import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {AuthorityOrganizationDetailPageComponent} from './authority-organization-detail-page/authority-organization-detail-page.component';
import {AuthorityOrganizationDetailPageStateImpl} from './state/authority-organization-detail-page-state-impl';

@NgModule({
  declarations: [AuthorityOrganizationDetailPageComponent],
  imports: [
    // Angular
    CommonModule,

    // NGXS
    NgxsModule.forFeature([AuthorityOrganizationDetailPageStateImpl]),

    // Authority Portal
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class AuthorityOrganizationDetailPageModule {}
