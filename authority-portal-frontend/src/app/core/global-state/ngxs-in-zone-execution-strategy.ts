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
import { Injectable, NgZone } from '@angular/core';
import { NgxsExecutionStrategy } from '@ngxs/store';


@Injectable({providedIn: 'root'})
export class NgxsInZoneExecutionStrategy implements NgxsExecutionStrategy {
  constructor(private zone: NgZone) {}

  enter<T>(func: () => T): T {
    return this.zone.run(() => func());
  }

  leave<T>(func: () => T): T {
    return this.zone.runOutsideAngular(() => func());
  }
}
