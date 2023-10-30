import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {OrganizationDetailComponent} from 'src/app/shared/components/organization-detail/organization-detail.component';
import {UserRoleFormComponent} from 'src/app/shared/components/user-role-form/user-role-form.component';
import {PipesAndDirectivesModule} from '../common/components/pipes-and-directives/pipes-and-directives.module';
import {AvatarComponent} from './components/avatar/avatar.component';
import {UserDetailComponent} from './components/user-detail/user-detail.component';

@NgModule({
  declarations: [
    UserRoleFormComponent,
    OrganizationDetailComponent,
    UserDetailComponent,
    AvatarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DevUtilsModule,

    // Angular Material
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingElementModule,
    ErrorElementModule,
    PipesAndDirectivesModule,
  ],
  exports: [OrganizationDetailComponent, UserDetailComponent, AvatarComponent],
})
export class SharedModule {}
