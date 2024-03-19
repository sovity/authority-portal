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
  // may need refinements
  applicationRolesTooltip = `
AUTHORITY USER
Can view all participant details, invite new participants and manage pending registration requests

AUTHORITY ADMIN 
Can additionally manage application roles for all users

SERVICE PARTNER ADMIN
Can provide connectors for other participants and manage them

OPERATOR ADMIN
Can provide and manage central components in DAPS and manage all connectors
  `;
}
