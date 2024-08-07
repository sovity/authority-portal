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
import {Component, HostBinding, Inject} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '../../../../core/services/config/app-config';

@Component({
  selector: 'app-footer-copyright',
  templateUrl: './footer-copyright.component.html',
})
export class FooterCopyrightComponent {
  @HostBinding('class.flex')
  @HostBinding('class.items-center')
  cls = true;
  thisYear: number = new Date().getFullYear();

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}
}
