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
import {Observable, of} from 'rxjs';
import {catchError, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {ApiService} from 'src/app/core/api/api.service';
import {ToastService} from 'src/app/shared/common/toast-notifications/toast.service';
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
      tap(() => {
        this.toast.showSuccess(
          `The invitation for ${action.request.firstName} ${action.request.lastName} was sent.`,
        );
        ctx.patchState({state: 'success'});
        action.success();
      }),
      catchError((err) => {
        let errorMessage = 'Failed inviting user due to an unknown error.';
        if (err?.response?.status === 409) {
          errorMessage = 'A user with this email address already exists.';
        }
        this.toast.showDanger(errorMessage);
        ctx.patchState({state: 'error'});
        action.enableForm();
        return of(null);
      }),
      ignoreElements(),
    );
  }
}
