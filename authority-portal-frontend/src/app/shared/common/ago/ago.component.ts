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
import {Component, Input} from '@angular/core';

/**
 * Displays a date as estimated relative time (e.g. "3 days ago").
 *
 * But also shows the full date as a tooltip.
 */
@Component({
  selector: 'ago',
  template: `<span [title]="date | date : 'EEEE yyyy-MM-dd hh:mm'">{{
    date | ago | async
  }}</span>`,
})
export class AgoComponent {
  @Input()
  date?: Date | null;
}
