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

import {ControlCenterUserEditPageForm} from '../control-center-user-edit-page/control-center-user-edit-page.form';
import {ControlCenterUserEditPageFormValue} from '../control-center-user-edit-page/control-center-user-edit-page.form-model';

const tag = 'ControlCenterUserEditPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;

  constructor(
    /**
     * Function for setting the form. This is required because the form won't survive being frozen as all state values are
     */
    public setFormInComponent: (
      form: ControlCenterUserEditPageForm | null,
    ) => void,
  ) {}
}

export class Submit {
  static readonly type = `[${tag}] Submit`;

  constructor(public formValue: ControlCenterUserEditPageFormValue) {}
}
