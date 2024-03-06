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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MemberInfo} from '@sovity.de/authority-portal-client';
import {getOrganizationUserRegistrationStatusClasses} from 'src/app/core/utils/ui-utils';
import {
  getHighestApplicationRole,
  getHighestParticipantRole,
  mapRolesToReadableFormat,
} from 'src/app/core/utils/user-role-utils';

export interface Members extends MemberInfo {
  applicationRole: string;
  participantRole: string;
}

@Component({
  selector: 'app-shared-user-list',
  templateUrl: './shared-user-list.component.html',
})
export class SharedUserListComponent implements OnInit {
  @Input() organizationId!: string;
  @Input() members!: MemberInfo[];
  @Output() selectUserEvent = new EventEmitter<MemberInfo>();

  modifiedMembers!: Members[];

  getOrganizationUserRegistrationStatusClasses =
    getOrganizationUserRegistrationStatusClasses;
  selectedRole: any;

  ngOnInit(): void {
    this.modifiedMembers = this.members.map((member: MemberInfo) => {
      let highestApplicationRole = getHighestApplicationRole(member.roles);
      return {
        ...member,
        applicationRole: highestApplicationRole
          ? mapRolesToReadableFormat(highestApplicationRole)
          : '',
        participantRole: mapRolesToReadableFormat(
          getHighestParticipantRole(member.roles),
        ),
      };
    });
  }

  selectUser(user: MemberInfo) {
    this.selectUserEvent.emit(user);
  }
}
