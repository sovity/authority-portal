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

@Component({
  selector: 'app-application-roles-tooltip',
  templateUrl: './application-roles-tooltip.component.html',
})
export class ApplicationRolesTooltipComponent {
  applicationRolesTooltip = `
- AUTHORITY USER
user has the rights to see the list and details of all organizations, invite new organizations, accept & reject pending requests

- AUTHORITY ADMIN 
can additionally manage application roles of users of any organization via the user list of each organization

- SERVICE PARTNER ADMIN
role allows user to provide connectors, delete them and see the list of all provided connectors

- OPERATOR ADMIN
role allows user to see the list of all provided connectors and delete them
and also provide Central Components and see the list of Central Dataspace Components registered at the DAPS.
  `;
}
