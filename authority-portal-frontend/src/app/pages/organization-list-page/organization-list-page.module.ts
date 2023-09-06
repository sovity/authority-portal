import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {OrganizationListPageComponent} from './organization-list-page/organization-list-page.component';
import {OrganizationListPageStateImpl} from './state/organization-list-page-state-impl';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // NGXS
    NgxsModule.forFeature([OrganizationListPageStateImpl]),

    // Authority Portal
    // [...]
  ],
  declarations: [OrganizationListPageComponent],
  exports: [OrganizationListPageComponent],
})
export class OrganizationListPageModule {}
