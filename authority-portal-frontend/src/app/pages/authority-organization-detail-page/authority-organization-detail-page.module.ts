import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityOrganizationDetailPageComponent} from './authority-organization-detail-page/authority-organization-detail-page.component';
import {AuthorityOrganizationDetailPageStateImpl} from './state/authority-organization-detail-page-state-impl';
import {OrganizationDetailInfoComponent} from './sub-pages/organization-detail-info/organization-detail-info.component';
import {OrganizationUserDetailComponent} from './sub-pages/organization-user-detail/organization-user-detail.component';
import {OrganizationUserListComponent} from './sub-pages/organization-user-list/organization-user-list.component';

@NgModule({
  declarations: [
    AuthorityOrganizationDetailPageComponent,

    //sub-pages
    OrganizationDetailInfoComponent,
    OrganizationUserListComponent,
    OrganizationUserDetailComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MaterialModule,

    // NGXS
    NgxsModule.forFeature([AuthorityOrganizationDetailPageStateImpl]),

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
    PipesAndDirectivesModule,
  ],
})
export class AuthorityOrganizationDetailPageModule {}
