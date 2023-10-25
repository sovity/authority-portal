import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {UserProfilePageStateImpl} from 'src/app/pages/user-profile-page/state/user-profile-page-state-impl';
import {SharedModule} from 'src/app/shared/shared.module';
import {UserProfilePageComponent} from './user-profile-page/user-profile-page.component';

@NgModule({
  declarations: [UserProfilePageComponent],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([UserProfilePageStateImpl]),

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    PipesAndDirectivesModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class UserProfilePageModule {}
