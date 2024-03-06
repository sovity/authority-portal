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
import {FormControl} from '@angular/forms';
import {Observable, forkJoin} from 'rxjs';
import {finalize, ignoreElements, tap} from 'rxjs/operators';
import {IdResponse, UserRoleDto} from '@sovity.de/authority-portal-client';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';
import {ApiService} from '../../../../core/api/api.service';
import {ErrorService} from '../../../../core/error.service';
import {ToastService} from '../../../../core/toast-notifications/toast.service';
import {setEnabled} from '../../../../core/utils/form-utils';
import {UserDetailConfig} from './shared-user-detail.model';

@Component({
  selector: 'app-shared-user-detail',
  templateUrl: './shared-user-detail.component.html',
})
export class SharedUserDetailComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.my-6')
  @HostBinding('class.@container') // tailwind container queries
  cls = true;

  @Input()
  config!: UserDetailConfig;

  applicationRoleCtrl = new FormControl<UserRoleDto | null>(null);
  participantRoleCtrl = new FormControl<UserRoleDto>('USER');

  roleFormToggled = false;
  roleEditBusy = false;

  constructor(
    private apiService: ApiService,
    private errorService: ErrorService,
    private toast: ToastService,
  ) {}

  onRoleEditShowClick() {
    this.roleFormToggled = true;
    this.applicationRoleCtrl.reset(this.config.roles.currentApplicationRole);

    this.participantRoleCtrl.enable();
    this.participantRoleCtrl.reset(this.config.roles.currentParticipantRole);
    setEnabled(
      this.participantRoleCtrl,
      this.config.roles.canChangeParticipantRole,
    );
  }

  onRoleEditCancel() {
    this.roleFormToggled = false;
  }

  onRoleEditSubmitClick() {
    const newApplicationRole = this.applicationRoleCtrl.value;
    const hasNewApplicationRole =
      newApplicationRole !== this.config.roles.currentApplicationRole;

    const newParticipantRole = this.participantRoleCtrl.value;
    const hasNewParticipantRole =
      newParticipantRole !== this.config.roles.currentParticipantRole &&
      newParticipantRole != null;

    if (this.roleEditBusy) {
      return;
    }

    const requests$: Observable<never>[] = [];
    if (hasNewApplicationRole) {
      requests$.push(this.updateApplicationRole(newApplicationRole));
    }
    if (hasNewParticipantRole) {
      requests$.push(this.updateParticipantRole(newParticipantRole));
    }

    this.roleEditBusy = true;
    forkJoin(requests$)
      .pipe(finalize(() => (this.roleEditBusy = false)))
      .subscribe({
        complete: () => {
          this.config.roles.onRoleUpdateSuccessful();
          this.roleFormToggled = false;
        },
      });
  }

  onboardingType(type: string) {
    switch (type) {
      case 'INVITATION':
        return 'Invitation';
      case 'SELF_REGISTRATION':
        return 'Self Registration';
      default:
        return '';
    }
  }

  private updateApplicationRole(newApplicationRole: UserRoleDto | null) {
    let request$: Observable<IdResponse>;
    if (newApplicationRole == null) {
      request$ = this.apiService.clearApplicationRole(this.config.userId);
    } else {
      request$ = this.apiService.updateApplicationRole(
        this.config.userId,
        newApplicationRole,
      );
    }
    return request$.pipe(
      tap(() =>
        this.toast.showSuccess(`Successfully updated application role`),
      ),
      this.errorService.toastFailureRxjs('Failed to update application role'),
      ignoreElements(),
    );
  }

  private updateParticipantRole(newParticipantRole: UserRoleDto) {
    return this.apiService
      .updateParticipantRole(this.config.userId, newParticipantRole)
      .pipe(
        tap(() =>
          this.toast.showSuccess(`Successfully updated participant role`),
        ),
        this.errorService.toastFailureRxjs('Failed to update participant role'),
        ignoreElements(),
      );
  }

  UserRoleDto = UserRoleDto;
  mapRolesToReadableFormat = mapRolesToReadableFormat;
}
