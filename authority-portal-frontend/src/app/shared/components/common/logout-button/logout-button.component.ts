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

import {Component, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';

@Component({
  selector: 'logout-button',
  templateUrl: './logout-button.component.html',
})
export class LogoutButtonComponent {
  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
