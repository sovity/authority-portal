import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {CertificateGenerateService} from 'src/app/shared/services/certificate-generate.service';
import {FormElementsModule} from '../common/components/form-elements/form-elements.module';
import {PipesAndDirectivesModule} from '../common/components/pipes-and-directives/pipes-and-directives.module';
import {ConnectorRegisteringSuccessMessagePageComponent} from './components/business/connector-registering-success-message-page/connector-registering-success-message-page.component';
import {ConnectorStatusLedComponent} from './components/business/connector-status-led/connector-status-led.component';
import {DeleteConnectorModalComponent} from './components/business/delete-connector-modal/delete-connector-modal.component';
import {FooterCopyrightComponent} from './components/business/footer-copyright/footer-copyright.component';
import {FooterForFullPageComponent} from './components/business/footer-for-full-page/footer-for-full-page.component';
import {FooterLinksComponent} from './components/business/footer-links/footer-links.component';
import {OrganizationCreateFormComponent} from './components/business/organization-create-form/organization-create-form.component';
import {OrganizationEditFormComponent} from './components/business/organization-edit-form/organization-edit-form.component';
import {SharedConnectorDetailComponent} from './components/business/shared-connector-detail/shared-connector-detail.component';
import {SharedOrganizationDetailComponent} from './components/business/shared-organization-detail/shared-organization-detail.component';
import {SharedUserDetailComponent} from './components/business/shared-user-detail/shared-user-detail.component';
import {SharedUserListComponent} from './components/business/shared-user-list/shared-user-list.component';
import {UserCreateFormComponent} from './components/business/user-create-form/user-create-form.component';
import {UserDeleteDialogComponent} from './components/business/user-delete-dialog/user-delete-dialog.component';
import {UserDeleteDialogService} from './components/business/user-delete-dialog/user-delete-dialog.service';
import {UserEditFormComponent} from './components/business/user-edit-form/user-edit-form.component';
import {UserOnboardFormComponent} from './components/business/user-onboard-form/user-onboard-form.component';
import {AvatarComponent} from './components/common/avatar/avatar.component';
import {ConfirmationDialogComponent} from './components/common/confirmation-dialog/confirmation-dialog.component';
import {FilterBarComponent} from './components/common/filter-bar/filter-bar.component';
import {HeaderBarComponent} from './components/common/header-bar/header-bar.component';
import {LogoutButtonComponent} from './components/common/logout-button/logout-button.component';
import {SelectionBoxComponent} from './components/common/selection-box/selection-box.component';
import {SlideOverComponent} from './components/common/slide-over/slide-over.component';
import {TitleBarComponent} from './components/common/title-bar/title-bar.component';
import {SlideOverService} from './services/slide-over.service';
import {SvgIconServiceService} from './services/svg-icon.service.service';

@NgModule({
  declarations: [
    AvatarComponent,
    ConfirmationDialogComponent,
    ConnectorRegisteringSuccessMessagePageComponent,
    ConnectorStatusLedComponent,
    DeleteConnectorModalComponent,
    FilterBarComponent,
    FooterCopyrightComponent,
    FooterForFullPageComponent,
    FooterLinksComponent,
    HeaderBarComponent,
    LogoutButtonComponent,
    OrganizationCreateFormComponent,
    OrganizationEditFormComponent,
    SelectionBoxComponent,
    SharedConnectorDetailComponent,
    SharedOrganizationDetailComponent,
    SharedUserDetailComponent,
    SharedUserListComponent,
    SlideOverComponent,
    TitleBarComponent,
    UserCreateFormComponent,
    UserDeleteDialogComponent,
    UserEditFormComponent,
    UserOnboardFormComponent,
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
    FormElementsModule,
    DevUtilsModule,
  ],
  exports: [
    AvatarComponent,
    ConfirmationDialogComponent,
    ConnectorRegisteringSuccessMessagePageComponent,
    ConnectorStatusLedComponent,
    DeleteConnectorModalComponent,
    FilterBarComponent,
    FooterCopyrightComponent,
    FooterForFullPageComponent,
    FooterLinksComponent,
    HeaderBarComponent,
    LogoutButtonComponent,
    OrganizationCreateFormComponent,
    OrganizationEditFormComponent,
    SelectionBoxComponent,
    SharedConnectorDetailComponent,
    SharedOrganizationDetailComponent,
    SharedUserDetailComponent,
    SharedUserListComponent,
    SlideOverComponent,
    TitleBarComponent,
    UserCreateFormComponent,
    UserDeleteDialogComponent,
    UserEditFormComponent,
    UserOnboardFormComponent,
    ConnectorStatusLedComponent,
  ],
  providers: [
    CertificateGenerateService,
    SvgIconServiceService,
    SlideOverService,
    AvatarComponent,
    UserDeleteDialogService,
  ],
})
export class SharedModule {
  constructor(private svgIconServiceService: SvgIconServiceService) {
    const iconsList = [
      'account-circle',
      'arrow-down-tray',
      'arrow-left-on-rectangle',
      'bell',
      'briefcase',
      'building-office-2',
      'building-office',
      'checkbox',
      'chevron-down',
      'chevron-left',
      'chevron-up',
      'connector-2',
      'connector',
      'dashboard',
      'document-text',
      'ellipsis-horizontal',
      'extension',
      'github',
      'home',
      'navigation-next',
      'pencil',
      'question-mark-circle',
      'search',
      'status',
      'support',
      'tag',
      'user',
      'users',
      'profile',
    ];
    this.svgIconServiceService.initializeIcons(iconsList); // to registers all the SVG icons in matIconRegistry
  }
}
