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
import {ConnectorDetailsDto} from '@sovity.de/authority-portal-client';
import {ClipboardUtils} from 'src/app/core/utils/clipboard-utils';
import {getConnectorStatusText} from 'src/app/core/utils/ui-utils';

@Component({
  selector: 'app-shared-connector-detail',
  templateUrl: './shared-connector-detail.component.html',
})
export class SharedConnectorDetailComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.my-6')
  @HostBinding('class.@container') // tailwind container queries
  cls = true;

  @Input() connector!: ConnectorDetailsDto;

  getConnectorStatusText = getConnectorStatusText;

  constructor(private clipboardUtils: ClipboardUtils) {}

  copyToClipboard(param: string) {
    this.clipboardUtils.copyToClipboard(param);
  }
}
