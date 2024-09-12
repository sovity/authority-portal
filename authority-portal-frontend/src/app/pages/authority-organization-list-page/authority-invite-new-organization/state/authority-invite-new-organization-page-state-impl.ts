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
import {
  Action,
  Actions,
  State,
  StateContext,
  Store,
  ofAction,
} from '@ngxs/store';
import {ApiService} from 'src/app/core/api/api.service';
import {RefreshOrganizations} from 'src/app/pages/authority-organization-list-page/authority-organization-list-page/state/authority-organization-list-page-actions';
import {ToastService} from 'src/app/shared/common/toast-notifications/toast.service';
import {ErrorService} from '../../../../core/services/error.service';
import {
  InviteNewOrganization,
  Reset,
} from './authority-invite-new-organization-page-actions';
import {
  AuthorityInviteNewOrganizationPageState,
  DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE,
} from './authority-invite-new-organization-page-state';

@State<AuthorityInviteNewOrganizationPageState>({
  name: 'AuthorityInviteNewOrganizationPageState',
  defaults: DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE,
})
@Injectable()
export class AuthorityInviteNewOrganizationPageStateImpl {
  constructor(
    private apiService: ApiService,
    private toast: ToastService,
    private actions$: Actions,
    private store: Store,
    private errorService: ErrorService,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<AuthorityInviteNewOrganizationPageState>): void {
    ctx.setState(DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE);
  }

  @Action(InviteNewOrganization)
  onInviteNewOrganization(
    ctx: StateContext<AuthorityInviteNewOrganizationPageState>,
    action: InviteNewOrganization,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();
    return this.apiService.inviteOrganization(action.request).pipe(
      tap(() => {
        this.toast.showSuccess(
          `The invitation for ${action.request.orgName} was sent.`,
        );
        ctx.patchState({state: 'success'});
        this.store.dispatch(RefreshOrganizations);
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastRegistrationErrorRxjs(
        'Failed inviting organization due to an unknown error.',
        () => {
          ctx.patchState({state: 'error'});
          action.enableForm();
        },
      ),
      ignoreElements(),
    );
  }
}
