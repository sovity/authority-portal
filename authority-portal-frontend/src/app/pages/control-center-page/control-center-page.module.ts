import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ControlCenterPageComponent} from './control-center-page/control-center-page.component';
import {ControlCenterPageStateImpl} from './state/control-center-page-state-impl';
import {OrganizationProfileComponent} from './sub-pages/organization-profile/organization-profile.component';
import {OrganizationUserComponent} from './sub-pages/organization-user/organization-user.component';
import {OrganizationUsersComponent} from './sub-pages/organization-users/organization-users.component';
import {UserProfileComponent} from './sub-pages/user-profile/user-profile.component';

@NgModule({
  declarations: [
    ControlCenterPageComponent,

    //sub-pages
    UserProfileComponent,
    OrganizationProfileComponent,
    OrganizationUsersComponent,
    OrganizationUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterPageStateImpl]),

    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class ControlCenterPageModule {}
