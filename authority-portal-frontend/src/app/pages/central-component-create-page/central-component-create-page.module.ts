import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PortalLayoutModule} from 'src/app/common/layouts/portal-layout/portal-layout.module';
import {FormElementsModule} from '../../common/components/form-elements/form-elements.module';
import {
  CentralComponentCreatePageComponent
} from './central-component-create-page/central-component-create-page.component';
import {CentralComponentCreatePageStateImpl} from './state/central-component-create-page-state-impl';

@NgModule({
  declarations: [CentralComponentCreatePageComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Ngxs
    NgxsModule.forFeature([CentralComponentCreatePageStateImpl]),

    // AP
    PortalLayoutModule,
    FormElementsModule,
    DevUtilsModule,
  ],
})
export class CentralComponentCreatePageModule {}
