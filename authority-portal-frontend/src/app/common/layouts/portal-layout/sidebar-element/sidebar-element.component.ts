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
import {SidebarMenu} from './sidebar-element.model';

@Component({
  selector: 'app-sidebar-element',
  templateUrl: './sidebar-element.component.html',
})
export class SidebarElementComponent {
  @Input() sidebarMenu!: SidebarMenu;
  @Input() isExpandedMenu!: boolean;
}
