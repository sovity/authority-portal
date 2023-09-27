import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {SpConnectorListPageComponent} from './sp-connector-list-page/sp-connector-list-page.component';
import {SpConnectorListPageStateImpl} from './state/sp-connector-list-page-state-impl';

@NgModule({
  declarations: [SpConnectorListPageComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([SpConnectorListPageStateImpl]),

    // Authority Portal
    PortalLayoutModule,
    PipesAndDirectivesModule,
  ],
})
export class SpConnectorListPageModule {}
