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
import { Observable, OperatorFunction, defer, from } from 'rxjs';
import { filter } from 'rxjs/operators';


export const toObservable = <T>(fn: () => Promise<T>): Observable<T> =>
  defer(() => from(fn()));

/**
 * Simple not null filtering RXJS Operator.
 *
 * The trick is that it removes the "null | undefined" from the resulting stream type signature.
 */
export function filterNotNull<T>(): OperatorFunction<T | null | undefined, T> {
  return filter((it) => it != null) as any;
}
