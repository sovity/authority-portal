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
import {Component, Inject, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';

@Component({
  selector: 'app-tos-check',
  templateUrl: './tos-check.component.html',
})
export class TosCheckComponent {
  @Input()
  ctrl: FormControl<boolean> = new FormControl();

  @Input()
  ctrlId = 'dsgvo-tos';

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}
}
