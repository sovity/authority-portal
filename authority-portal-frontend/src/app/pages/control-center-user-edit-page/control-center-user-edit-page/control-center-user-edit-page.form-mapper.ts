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
import {UpdateUserDto, UserDetailDto} from '@sovity.de/authority-portal-client';
import {ControlCenterUserEditPageFormValue} from './control-center-user-edit-page.form-model';

export function buildFormValue(
  user: UserDetailDto,
): ControlCenterUserEditPageFormValue {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    jobTitle: user.position,
    phoneNumber: user.phone,
  };
}

export function buildEditRequest(
  formValue: ControlCenterUserEditPageFormValue,
): UpdateUserDto {
  return {
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    email: formValue.email,
    jobTitle: formValue.jobTitle,
    phone: formValue.phoneNumber,
  };
}
