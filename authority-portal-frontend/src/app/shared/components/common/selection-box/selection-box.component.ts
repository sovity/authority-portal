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
import {Router} from '@angular/router';
import {SelectionBoxModel} from './selection-box.model';

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
})
export class SelectionBoxComponent {
  @Input() config!: SelectionBoxModel;
  constructor(private router: Router) {}

  onAction() {
    if (this.config?.action?.url) {
      if (!this.config.action.isDisabled) {
        this.router.navigate([this.config.action.url]);
      }
    }
    if (this.config?.action?.externalUrl) {
      window.open(this.config.action.externalUrl, '_blank');
    }
  }
}
