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
  selector: 'app-organization-roles-tooltip',
  templateUrl: './organization-roles-tooltip.component.html',
})
export class OrganizationRolesTooltipComponent {
  organizationRolesTooltip = `
USER
is the basic role that allows a person to open multiple participant related sections in portal.

KEY USER
can additionally manage and interact with an organization's connectors and data offerings/requests.

ADMIN
can additionally manage users, invite new users and update the organization's profile.`;
}
