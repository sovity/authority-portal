import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {ParticipantOwnConnectorListPageComponent} from './participant-own-connector-list-page/participant-own-connector-list-page.component';
import {ParticipantOwnConnectorListPageStateImpl} from './state/participant-own-connector-list-page-state-impl';

@NgModule({
  declarations: [ParticipantOwnConnectorListPageComponent],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ParticipantOwnConnectorListPageStateImpl]),

    // Authority Portal
    PortalLayoutModule,
    PipesAndDirectivesModule,
  ],
})
export class ParticipantOwnConnectorListPageModule {}
