import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {OrganizationDetailComponent} from 'src/app/shared/components/organization-detail/organization-detail.component';
import {AvatarComponent} from './components/avatar/avatar.component';
import {UserDetailComponent} from './components/user-detail/user-detail.component';

@NgModule({
  declarations: [
    OrganizationDetailComponent,
    UserDetailComponent,
    AvatarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    // Angular Material
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

    LoadingElementModule,
    ErrorElementModule,
  ],
  exports: [OrganizationDetailComponent, UserDetailComponent, AvatarComponent],
})
export class SharedModule {}
