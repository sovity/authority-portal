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
import {Observable} from 'rxjs';

const tag = 'ControlCenterUserProfilePage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
  constructor(public componentLifetime$: Observable<any>) {}
}
