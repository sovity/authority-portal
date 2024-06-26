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
import { Component, HostBinding, Input } from '@angular/core';
import { PropertyGridGroup } from './property-grid-group';


@Component({
  selector: 'property-grid-group',
  templateUrl: './property-grid-group.component.html',
})
export class PropertyGridGroupComponent {
  @Input()
  propGroups: PropertyGridGroup[] = [];

  @Input()
  columns: number = 3;

  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-start')
  @HostBinding('class.gap-4')
  cls = true;
}
