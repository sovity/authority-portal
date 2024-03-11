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
import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-error-element',
  templateUrl: './error-element.component.html',
})
export class ErrorElementComponent {
  @HostBinding('class.flex')
  @HostBinding('class.items-center')
  @HostBinding('class.justify-center')
  @HostBinding('class.text-center')
  @HostBinding('class.px-6')
  @HostBinding('class.py-24')
  @HostBinding('class.sm:py-32')
  @HostBinding('class.lg:px-8')
  cls = true;

  @Input() errorMessage: string = '';
}
