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
import {Component, HostBinding, Input, TrackByFunction} from '@angular/core';
import {PropertyGridField} from './property-grid-field';

@Component({
  selector: 'property-grid',
  templateUrl: './property-grid.component.html',
})
export class PropertyGridComponent {
  @Input()
  props: PropertyGridField[] = [];

  @Input()
  columns: number = 3;
  @HostBinding('class.grid')
  @HostBinding('class.grid-cols-3')
  @HostBinding('class.gap-4')
  cls = true;

  trackByIndex: TrackByFunction<any> = (index: number) => index;
}
