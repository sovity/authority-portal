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

import {Component} from '@angular/core';
import {SelectionBoxModel} from 'src/app/shared/components/common/selection-box/selection-box.model';

@Component({
  selector: 'app-choose-participant-connector',
  templateUrl: './choose-participant-connector.component.html',
})
export class ChooseParticipantConnectorComponent {
  selectionBoxes: SelectionBoxModel[] = [
    {
      title: 'I have a connector',
      subTitle: 'Follow the process to set-up your self-hosted connector here',
      icon: 'self-hosted-connector_logo.svg',
      action: {
        url: '/my-organization/connectors/new/self-hosted',
      },
    },
    {
      title: 'I need a connector',
      subTitle:
        'Request a managed connector to begin your journey in data spaces',
      icon: 'request-caas_logo.svg',
      action: {
        url: '/my-organization/connectors/new/choose-provider',
      },
    },
  ];
}
