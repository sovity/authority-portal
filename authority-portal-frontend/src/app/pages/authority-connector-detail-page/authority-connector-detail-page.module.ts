import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityConnectorDetailPageComponent} from './authority-connector-detail-page/authority-connector-detail-page.component';
import {AuthorityConnectorDetailPageStateImpl} from './state/authority-connector-detail-page-state-impl';

@NgModule({
  declarations: [AuthorityConnectorDetailPageComponent],
  imports: [
    CommonModule,

    // NGXS
    NgxsModule.forFeature([AuthorityConnectorDetailPageStateImpl]),

    // Authority Portal
    LoadingElementModule,
    ErrorElementModule,
    MaterialModule,
    SharedModule,
  ],
})
export class AuthorityConnectorDetailPageModule {}
