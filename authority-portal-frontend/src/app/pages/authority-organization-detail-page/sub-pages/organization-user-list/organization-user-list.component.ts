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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MemberInfo} from '@sovity.de/authority-portal-client';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';

@Component({
  selector: 'app-organization-user-list',
  templateUrl: './organization-user-list.component.html',
})
export class OrganizationUserListComponent {
  @Input() users!: MemberInfo[];
  @Input() organizationId!: string;
  @Output() onUserSelected = new EventEmitter<MemberInfo>();

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }

  selectUser(user: MemberInfo): void {
    this.onUserSelected.emit(user);
  }
}
