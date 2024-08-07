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
import {Router} from '@angular/router';
import {APP_CONFIG, AppConfig} from '../../../core/services/config/app-config';
import {SelectionBoxModel} from './selection-box.model';

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
})
export class SelectionBoxComponent {
  @Input() selectionBoxConfig!: SelectionBoxModel;
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private router: Router,
  ) {}

  onAction() {
    if (this.selectionBoxConfig?.action?.url) {
      if (!this.selectionBoxConfig.action.isDisabled) {
        this.router.navigate([this.selectionBoxConfig.action.url]);
      }
    }
    if (this.selectionBoxConfig?.action?.externalUrl) {
      window.open(this.selectionBoxConfig.action.externalUrl, '_blank');
    }
  }
}
