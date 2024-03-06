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
import {OrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';

@Component({
  selector: 'app-organization-detail-info',
  templateUrl: './organization-detail-info.component.html',
})
export class OrganizationDetailInfoComponent {
  @Input() organization!: OrganizationDetailsDto;

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }
}
