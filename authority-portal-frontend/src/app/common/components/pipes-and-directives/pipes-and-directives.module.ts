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

import {NgModule} from '@angular/core';
import {CheckIfNotCurrentUserPipe} from './check-if-not-current-user.pipe';
import {DisabledButtonDirective} from './disabled-button.directive';
import {FilterByRegistrationStatusPipe} from './filter-by-registration-status.pipe';
import {FormControlErrorDirective} from './form-control-error.directive';
import {HasAnyRolePipe} from './has-any-role.pipe';
import {HasRolePipe} from './has-role.pipe';
import {SentenceCasePipe} from './sentence-case.pipe';

@NgModule({
  declarations: [
    CheckIfNotCurrentUserPipe,
    FilterByRegistrationStatusPipe,
    SentenceCasePipe,
    FormControlErrorDirective,
    HasAnyRolePipe,
    HasRolePipe,
    DisabledButtonDirective,
  ],
  exports: [
    CheckIfNotCurrentUserPipe,
    FilterByRegistrationStatusPipe,
    SentenceCasePipe,
    FormControlErrorDirective,
    HasAnyRolePipe,
    HasRolePipe,
    DisabledButtonDirective,
  ],
})
export class PipesAndDirectivesModule {}
