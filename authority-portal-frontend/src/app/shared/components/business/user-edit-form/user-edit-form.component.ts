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
import {UserEditFormModel} from './user-edit-form-model';

@Component({
  selector: 'app-user-edit-form',
  templateUrl: './user-edit-form.component.html',
})
export class UserEditFormComponent {
  @Input() userForm!: FormGroup<UserEditFormModel>;
}
