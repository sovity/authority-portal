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
import {ClipboardUtils} from 'src/app/core/utils/clipboard-utils';
import {ActiveFeatureSet} from '../../../core/services/config/active-feature-set';

@Component({
  selector: 'app-connector-registering-success-message-page',
  templateUrl: './connector-registering-success-message-page.component.html',
})
export class ConnectorRegisteringSuccessMessagePageComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-center')
  @HostBinding('class.items-center')
  @HostBinding('class.text-center')
  @HostBinding('class.my-12')
  cls = true;

  @Input()
  connectorConfig: string = '...';

  constructor(
    private clipboardUtils: ClipboardUtils,
    public activeFeatureSet: ActiveFeatureSet,
  ) {}

  copyToClipboard() {
    this.clipboardUtils.copyToClipboard(this.connectorConfig);
  }
}
