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
import cleanDeep from 'clean-deep';
import jsonStableStringify from 'json-stable-stringify';


/**
 * Sorts keys, sorts array values, removes emtpy keys.
 *
 * @param json any JSON object
 */
export function cleanJson<T>(json: T): Partial<T> {
  const cleaned = cleanDeep(json, {emptyStrings: false});
  return JSON.parse(jsonStableStringify(cleaned));
}
