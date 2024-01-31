import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {AuthorityConnectorListPageComponent} from './authority-connector-list-page/authority-connector-list-page.component';
import {AuthorityConnectorListPageStateImpl} from './state/authority-connector-list-page-state-impl';

@NgModule({
  declarations: [AuthorityConnectorListPageComponent],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    MaterialModule,
    DevUtilsModule,

    // NGXS
    NgxsModule.forFeature([AuthorityConnectorListPageStateImpl]),

    // Authority Portal
    PortalLayoutModule,
    PipesAndDirectivesModule,
    LoadingElementModule,
  ],
})
export class AuthorityConnectorListPageModule {}
