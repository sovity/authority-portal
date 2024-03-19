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
Basic role that allows access to multiple participant related sections in the portal.

KEY USER
Can additionally manage their organization's connectors and data offerings/requests.

ADMIN
Can additionally manage their organization, e.g. change organization details and manage members.`;
}
