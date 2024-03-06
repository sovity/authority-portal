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

import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-delete-icon-button',
  templateUrl: './delete-icon-button.component.html',
})
export class DeleteIconButtonComponent {
  @Input()
  disabled = false;

  @Input()
  loading = false;

  @Output()
  deleteClick = new EventEmitter<void>();

  get canClick(): boolean {
    return !this.disabled && !this.loading;
  }

  @HostListener('click')
  onClick() {
    if (this.canClick) {
      this.deleteClick.emit();
    }
  }
}
