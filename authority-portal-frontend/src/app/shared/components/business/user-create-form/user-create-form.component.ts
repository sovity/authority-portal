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
import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RegistrationUserTabFormModel} from '../../../../pages/registration-pages/organization-create-page/organization-create-page/organization-create-page.form-model';

@Component({
  selector: 'app-user-create-form',
  templateUrl: './user-create-form.component.html',
})
export class UserCreateFormComponent {
  @Input() userForm!: FormGroup<RegistrationUserTabFormModel>;
}
