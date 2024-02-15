import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {CreateOrganization, Reset} from './organization-create-page-action';
import {
  DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE,
  OrganizationRegistrationPageState,
} from './organization-create-page-state';

@State<OrganizationRegistrationPageState>({
  name: 'OrganizationCreatePage',
  defaults: DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE,
})
@Injectable()
export class OrganizationCreatePageStateImpl {
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private apiService: ApiService,
    private toast: ToastService,
    private errorService: ErrorService,
    private actions$: Actions,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<OrganizationRegistrationPageState>): void {
    ctx.setState(DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE);
  }

  @Action(CreateOrganization, {cancelUncompleted: true})
  onCreateOrganization(
    ctx: StateContext<OrganizationRegistrationPageState>,
    action: CreateOrganization,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();
    return this.apiService.registerOrganization(action.request).pipe(
      tap((res) => {
        this.toast.showSuccess(`Organization registered created successfully`);
        ctx.patchState({state: 'success'});
        ctx.patchState({id: res.id ?? ''});
        ctx.patchState({email: action.request.userEmail});
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed registering connector', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }
}
