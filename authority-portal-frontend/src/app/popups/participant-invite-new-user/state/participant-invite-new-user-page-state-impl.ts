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

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {InviteNewUser, Reset} from './participant-invite-new-user-page-actions';
import {
  DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE,
  ParticipantInviteNewUserPageState,
} from './participant-invite-new-user-page-state';

@State<ParticipantInviteNewUserPageState>({
  name: 'ParticipantInviteNewUserPageState',
  defaults: DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE,
})
@Injectable()
export class ParticipantInviteNewUserPageStateImpl {
  constructor(
    private apiService: ApiService,
    private toast: ToastService,
    private actions$: Actions,
    private errorService: ErrorService,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<ParticipantInviteNewUserPageState>): void {
    ctx.setState(DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE);
  }

  @Action(InviteNewUser)
  onInviteNewUser(
    ctx: StateContext<ParticipantInviteNewUserPageState>,
    action: InviteNewUser,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();
    return this.apiService.inviteUser(action.request).pipe(
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed Inviting User', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      tap(() => {
        this.toast.showSuccess(
          `The invitation for ${action.request.firstName} ${action.request.lastName} was sent.`,
        );
        ctx.patchState({state: 'success'});
        action.success();
      }),
      ignoreElements(),
    );
  }
}
