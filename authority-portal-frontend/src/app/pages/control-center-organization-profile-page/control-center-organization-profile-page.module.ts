import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ControlCenterOrganizationProfilePageComponent} from './control-center-organization-profile-page/control-center-organization-profile-page.component';
import {ControlCenterOrganizationProfilePageStateImpl} from './state/control-center-organization-profile-page-state-impl';

@NgModule({
  declarations: [ControlCenterOrganizationProfilePageComponent],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterOrganizationProfilePageStateImpl]),

    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class ControlCenterOrganizationProfilePageModule {}
