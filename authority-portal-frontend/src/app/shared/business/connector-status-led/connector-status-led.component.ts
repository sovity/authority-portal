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
import {ConnectorStatusDto} from '@sovity.de/authority-portal-client';
import {
  getConnectorStatusInnerCircleClasses,
  getConnectorStatusOuterRingClasses,
  getConnectorStatusText,
} from 'src/app/core/utils/ui-utils';

@Component({
  selector: 'app-connector-status-led',
  templateUrl: './connector-status-led.component.html',
})
export class ConnectorStatusLedComponent {
  @Input()
  status: ConnectorStatusDto = 'UNKNOWN';

  getConnectorStatusOuterRingClasses = getConnectorStatusOuterRingClasses;
  getConnectorStatusInnerCircleClasses = getConnectorStatusInnerCircleClasses;
  getConnectorStatusText = getConnectorStatusText;
}
