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
import {NgForOf} from '@angular/common';
import {Attribute, Directive, Host, TrackByFunction} from '@angular/core';

export const newTrackByFn =
  <T>(key: keyof T): TrackByFunction<T> =>
  (_, item: T) =>
    item == null ? null : item[key] ?? item;

/**
 * Creates Track By Function for ngFor loops
 */
@Directive({
  selector: '[trackByField]',
})
export class TrackByFieldDirective {
  constructor(
    @Host() ngForOf: NgForOf<unknown>,
    @Attribute('trackByField') private readonly trackByField: string,
  ) {
    if (!ngForOf.ngForTrackBy) {
      ngForOf.ngForTrackBy = newTrackByFn(this.trackByField);
    }
  }
}
