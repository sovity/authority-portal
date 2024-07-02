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
import {ɵFormGroupRawValue} from '@angular/forms';
import {UserEditFormModel} from '../../../shared/business/user-edit-form/user-edit-form-model';

export interface ControlCenterUserEditPageFormModel extends UserEditFormModel {}

export type ControlCenterUserEditPageFormValue =
  ɵFormGroupRawValue<ControlCenterUserEditPageFormModel>;
