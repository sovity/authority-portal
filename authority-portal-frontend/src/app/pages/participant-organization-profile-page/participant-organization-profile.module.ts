import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {ParticipantOrganizationProfilePageComponent} from 'src/app/pages/participant-organization-profile-page/participant-organization-profile-page/participant-organization-profile-page.component';
import {ParticipantOrganizationProfilePageStateImpl} from 'src/app/pages/participant-organization-profile-page/state/participant-organization-profile-page-state-impl';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ParticipantOrganizationProfilePageComponent],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // Angular Material
    MaterialModule,

    // NGXS
    NgxsModule.forFeature([ParticipantOrganizationProfilePageStateImpl]),

    // Authority Portal
    SharedModule,
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class ParticipantOrganizationProfileModule {}
