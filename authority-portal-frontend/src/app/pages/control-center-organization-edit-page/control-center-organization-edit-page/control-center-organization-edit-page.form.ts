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
import {switchDisabledControls} from '../../../core/utils/form-utils';
import {buildOrganizationEditForm} from '../../../shared/components/business/organization-edit-form/organization-edit-form-builder';
import {organizationEditFormEnabledCtrls} from '../../../shared/components/business/organization-edit-form/organization-edit-form-enabled-ctrls';
import {
  ControlCenterOrganizationEditPageFormModel,
  ControlCenterOrganizationEditPageFormValue,
} from './control-center-organization-edit-page.form-model';

export class ControlCenterOrganizationEditPageForm {
  group = this.buildFormGroup();

  get value(): ControlCenterOrganizationEditPageFormValue {
    return this.group.value as ControlCenterOrganizationEditPageFormValue;
  }

  constructor(
    private formBuilder: FormBuilder,
    private initialFormValue: ControlCenterOrganizationEditPageFormValue,
  ) {}

  buildFormGroup(): FormGroup<ControlCenterOrganizationEditPageFormModel> {
    const group: FormGroup<ControlCenterOrganizationEditPageFormModel> =
      buildOrganizationEditForm(this.formBuilder, this.initialFormValue);

    switchDisabledControls<ControlCenterOrganizationEditPageFormValue>(
      group,
      (value: ControlCenterOrganizationEditPageFormValue) =>
        organizationEditFormEnabledCtrls(value),
    );

    return group;
  }
}
