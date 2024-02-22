import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {SharedModule} from 'src/app/shared/shared.module';
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
    PipesAndDirectivesModule,
    LoadingElementModule,
    SharedModule,
  ],
})
export class AuthorityOrganizationListPageModule {}
