import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {LoadingElementModule} from '../loading-element/loading-element.module';
import {PipesAndDirectivesModule} from '../pipes-and-directives/pipes-and-directives.module';
import {CertificateGeneratorBarComponent} from './certificate-generator-bar/certificate-generator-bar.component';
import {CertificateInputFormComponent} from './certificate-input-form/certificate-input-form.component';
import {CertificateInputComponent} from './certificate-input/certificate-input.component';
import {ConnectorUrlInputComponent} from './connector-url-input/connector-url-input.component';
import {TosCheckComponent} from './dsgvo-input/tos-check.component';
import {OrganizationSelectComponent} from './organization-select/organization-select.component';
import {PasswordInputComponent} from './password-input/password-input.component';
import {PasswordRepeatInputComponent} from './password-repeat-input/password-repeat-input.component';
import {ReadonlyTextInputComponent} from './readonly-text-input/readonly-text-input.component';
import {TextInputComponent} from './text-input/text-input.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    // AP
    PipesAndDirectivesModule,
    LoadingElementModule,
  ],
  declarations: [
    CertificateGeneratorBarComponent,
    CertificateInputComponent,
    CertificateInputFormComponent,
    ConnectorUrlInputComponent,
    OrganizationSelectComponent,
    PasswordInputComponent,
    PasswordRepeatInputComponent,
    TextInputComponent,
    TosCheckComponent,
    ReadonlyTextInputComponent,
  ],
  exports: [
    CertificateGeneratorBarComponent,
    CertificateInputComponent,
    CertificateInputFormComponent,
    ConnectorUrlInputComponent,
    OrganizationSelectComponent,
    PasswordInputComponent,
    PasswordRepeatInputComponent,
    TextInputComponent,
    TosCheckComponent,
    ReadonlyTextInputComponent,
  ],
})
export class FormElementsModule {}
