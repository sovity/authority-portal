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
import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-footer-for-full-page',
  templateUrl: './footer-for-full-page.component.html',
})
export class FooterForFullPageComponent {
  @HostBinding('class.md:fixed')
  @HostBinding('class.md:left-0')
  @HostBinding('class.md:bottom-0')
  @HostBinding('class.px-10')
  @HostBinding('class.py-5')
  @HostBinding('class.text-xs')
  @HostBinding('class.text-gray-700')
  @HostBinding('class.flex')
  @HostBinding('class.justify-center')
  @HostBinding('class.gap-4')
  cls = true;
}
