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
import {FormBuilder, FormGroup} from '@angular/forms';
import {buildUserEditForm} from '../../../shared/business/user-edit-form/user-edit-form-builder';
import {
  ControlCenterUserEditPageFormModel,
  ControlCenterUserEditPageFormValue,
} from './control-center-user-edit-page.form-model';

export class ControlCenterUserEditPageForm {
  group = this.buildFormGroup();

  get value(): ControlCenterUserEditPageFormValue {
    return this.group.value as ControlCenterUserEditPageFormValue;
  }

  constructor(
    private formBuilder: FormBuilder,
    private initialFormValue: ControlCenterUserEditPageFormValue,
  ) {}

  buildFormGroup(): FormGroup<ControlCenterUserEditPageFormModel> {
    return buildUserEditForm(this.formBuilder, this.initialFormValue);
  }
}
