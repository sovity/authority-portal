import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {AuthorityConnectorDetailPageComponent} from './authority-connector-detail-page/authority-connector-detail-page.component';
import {AuthorityConnectorDetailPageStateImpl} from './state/authority-connector-detail-page-state-impl';

@NgModule({
  declarations: [AuthorityConnectorDetailPageComponent],
  imports: [
    CommonModule,

    // NGXS
    NgxsModule.forFeature([AuthorityConnectorDetailPageStateImpl]),

    // Authority Portal
    PortalLayoutModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class AuthorityConnectorDetailPageModule {}
