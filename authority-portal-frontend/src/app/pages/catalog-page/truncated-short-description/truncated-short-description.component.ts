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
  selector: 'truncated-short-description',
  templateUrl: './truncated-short-description.component.html',
})
export class TruncatedShortDescription {
  @Input() text!: string | undefined;
  @HostBinding('class.whitespace-pre-line')
  @HostBinding('class.line-clamp-5')
  cls = true;
  @HostBinding('class.italic')
  get italic(): boolean {
    return !this.text;
  }
}
