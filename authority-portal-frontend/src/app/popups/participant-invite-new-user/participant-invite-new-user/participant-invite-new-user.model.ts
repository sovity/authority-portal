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

import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type ParticipantInviteNewUserPageFormValue =
  ɵFormGroupRawValue<ParticipantInviteNewUserPageFormModel>;

export interface ParticipantInviteNewUserPageFormModel {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  role: FormControl<string>;
}

export const DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE: ParticipantInviteNewUserPageFormValue =
  {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  };
