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
import {Component, HostBinding, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-password-repeat-input',
  templateUrl: './password-repeat-input.component.html',
})
export class PasswordRepeatInputComponent {
  @HostBinding('class.select-none')
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-between')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  label = 'Confirm Password';

  @Input()
  ctrl: FormControl<string> = new FormControl();

  @Input()
  parentFormGroup: FormGroup = new FormGroup({});

  @Input()
  ctrlId = 'password-repeat';

  @Input()
  required = true;

  showPassword = false;
}
