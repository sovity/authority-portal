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
  onInviteNewOrganization(
    ctx: StateContext<ParticipantInviteNewUserPageState>,
    action: InviteNewUser,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();
    return this.apiService.inviteUser(action.request).pipe(
      tap(() => {
        this.toast.showSuccess(
          `The invitation for ${action.request.firstName} ${action.request.lastName} was sent.`,
        );
        ctx.patchState({state: 'success'});
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed Inviting User', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }
}
