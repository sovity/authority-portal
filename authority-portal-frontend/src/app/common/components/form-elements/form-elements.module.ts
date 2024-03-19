/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {LoadingElementModule} from '../loading-element/loading-element.module';
import {PipesAndDirectivesModule} from '../pipes-and-directives/pipes-and-directives.module';
import {ApplicationRolesTooltipComponent} from './application-roles-tooltip/application-roles-tooltip.component';
import {CertificateInputFormComponent} from './certificate-input-form/certificate-input-form.component';
import {CertificateInputComponent} from './certificate-input/certificate-input.component';
import {ConnectorUrlInputComponent} from './connector-url-input/connector-url-input.component';
import {TosCheckComponent} from './dsgvo-input/tos-check.component';
import {IndustrySelectComponent} from './industry-select/industry-select.component';
import {OrganizationRolesTooltipComponent} from './organization-roles-tooltip/organization-roles-tooltip.component';
import {OrganizationSelectComponent} from './organization-select/organization-select.component';
import {PasswordInputComponent} from './password-input/password-input.component';
import {PasswordRepeatInputComponent} from './password-repeat-input/password-repeat-input.component';
import {ReadonlyTextInputComponent} from './readonly-text-input/readonly-text-input.component';
import {TextAreaComponent} from './text-area/text-area.component';
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
    CertificateInputComponent,
    CertificateInputFormComponent,
    ConnectorUrlInputComponent,
    IndustrySelectComponent,
    OrganizationSelectComponent,
    PasswordInputComponent,
    PasswordRepeatInputComponent,
    TextAreaComponent,
    TextInputComponent,
    TosCheckComponent,
    ReadonlyTextInputComponent,
    OrganizationRolesTooltipComponent,
    ApplicationRolesTooltipComponent,
  ],
  exports: [
    CertificateInputComponent,
    CertificateInputFormComponent,
    ConnectorUrlInputComponent,
    IndustrySelectComponent,
    OrganizationSelectComponent,
    PasswordInputComponent,
    PasswordRepeatInputComponent,
    TextAreaComponent,
    TextInputComponent,
    TosCheckComponent,
    ReadonlyTextInputComponent,
    OrganizationRolesTooltipComponent,
    ApplicationRolesTooltipComponent,
  ],
})
export class FormElementsModule {}
