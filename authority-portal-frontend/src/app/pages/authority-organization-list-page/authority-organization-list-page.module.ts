import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {AuthorityOrganizationListPageComponent} from './authority-organization-list-page/authority-organization-list-page.component';
import {AuthorityOrganizationListPageStateImpl} from './state/authority-organization-list-page-state-impl';

@NgModule({
  declarations: [AuthorityOrganizationListPageComponent],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([AuthorityOrganizationListPageStateImpl]),

    // Authority Portal
    PortalLayoutModule,
    PipesAndDirectivesModule,
  ],
})
export class AuthorityOrganizationListPageModule {}
