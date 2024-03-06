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

import {StateContext} from '@ngxs/store';
import {Patcher} from './object-utils';

export function patchState<T>(ctx: StateContext<T>, patcher: Patcher<T>) {
  const state = ctx.getState();
  const patch = patcher(state);
  ctx.patchState(patch);
}
