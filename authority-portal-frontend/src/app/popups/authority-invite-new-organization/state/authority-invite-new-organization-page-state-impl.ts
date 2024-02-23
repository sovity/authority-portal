import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
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
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {RefreshOrganizations} from 'src/app/pages/authority-organization-list-page/state/authority-organization-list-page-actions';
import {ApiService} from '../../../core/api/api.service';
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
    private errorService: ErrorService,
    private store: Store,
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
      this.errorService.toastFailureRxjs('Failed Inviting Organization', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }
}
