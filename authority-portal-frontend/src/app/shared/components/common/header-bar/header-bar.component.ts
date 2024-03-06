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
import {HeaderBarConfig} from 'src/app/shared/components/common/header-bar/header-bar.model';

@Component({
  selector: 'app-header',
  templateUrl: './header-bar.component.html',
})
export class HeaderBarComponent {
  @Input() headerConfig!: HeaderBarConfig;

  @Input() disabled = false;
}
