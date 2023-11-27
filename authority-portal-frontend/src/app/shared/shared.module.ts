import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {OrganizationDetailComponent} from 'src/app/shared/components/business/organization-detail/organization-detail.component';
import {UserRoleFormComponent} from 'src/app/shared/components/business/user-role-form/user-role-form.component';
import {CertificateGenerateService} from 'src/app/shared/services/certificate-generate.service';
import {PipesAndDirectivesModule} from '../common/components/pipes-and-directives/pipes-and-directives.module';
import {UserDetailComponent} from './components/business/user-detail/user-detail.component';
import {AvatarComponent} from './components/common/avatar/avatar.component';
import {FilterBarComponent} from './components/common/filter-bar/filter-bar.component';
import {HeaderBarComponent} from './components/common/header-bar/header-bar.component';
import {IframeComponent} from './components/common/iframe/iframe.component';
import {SelectionBoxComponent} from './components/common/selection-box/selection-box.component';
import {SlideOverComponent} from './components/common/slide-over/slide-over.component';
import {SvgIconServiceService} from './services/svg-icon.service.service';

@NgModule({
  declarations: [
    //components
    UserRoleFormComponent,
    OrganizationDetailComponent,
    UserDetailComponent,
    AvatarComponent,
    HeaderBarComponent,
    FilterBarComponent,
    SlideOverComponent,
    SelectionBoxComponent,
    IframeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DevUtilsModule,

    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingElementModule,
    ErrorElementModule,
    PipesAndDirectivesModule,
  ],
  exports: [
    //components
    OrganizationDetailComponent,
    UserDetailComponent,
    AvatarComponent,
    HeaderBarComponent,
    FilterBarComponent,
    SlideOverComponent,
    SelectionBoxComponent,
    IframeComponent,
  ],
  providers: [CertificateGenerateService, SvgIconServiceService],
})
export class SharedModule {
  constructor(private svgIconServiceService: SvgIconServiceService) {
    const iconsList = [
      'connector',
      'search',
      'tag',
      'status',
      'chevron-up',
      'chevron-down',
      'pencil',
      'ellipsis-horizontal',
      'user',
      'bell',
      'briefcase',
      'users',
      'arrow-left-on-rectangle',
      'home',
      'building-office',
      'building-office-2',
      'document-text',
      'question-mark-circle',
      'checkbox',
      'arrow-down-tray',
    ];
    this.svgIconServiceService.initializeIcons(iconsList); // to registers all the SVG icons in matIconRegistry
  }
}
