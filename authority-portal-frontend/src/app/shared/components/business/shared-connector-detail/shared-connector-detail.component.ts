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
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {copyToClipboard} from '../../../../core/utils/clipboard-utils';
import {getConnectorStatusText} from '../../../../core/utils/ui-utils';

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

  @Input() connector!: ConnectorDetailDto;

  getConnectorStatusText = getConnectorStatusText;
  copyToClipboard = copyToClipboard;
}
