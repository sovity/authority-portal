import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ControlCenterOrganizationMembersPageComponent} from './control-center-organization-members-page/control-center-organization-members-page.component';
import {ControlCenterOrganizationMembersPageStateImpl} from './state/control-center-organization-members-page-state-impl';

@NgModule({
  declarations: [ControlCenterOrganizationMembersPageComponent],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterOrganizationMembersPageStateImpl]),

    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class ControlCenterOrganizationMembersPageModule {}
