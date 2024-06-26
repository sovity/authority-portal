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
import { removeOnce } from './array-utils';


describe('array-utils', () => {
  it('should work on empty list', () => {
    expect(removeOnce([], 'idk')).toEqual([]);
  });
  it('should remove item', () => {
    expect(removeOnce([1], 1)).toEqual([]);
  });
  it('should remove only single item', () => {
    expect(removeOnce([1, 2, 2, 3], 2)).toEqual([1, 2, 3]);
  });
});
