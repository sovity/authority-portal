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

export function nonNull<T>(array: (T | null)[]): T[] {
  return array.filter((it) => it != null) as T[];
}

export type KeysOfType<O, T> = {
  [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];

export function isValueOfEnum<T>(
  enumObj: {[key in keyof T]: T[key]},
  value: any,
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}
