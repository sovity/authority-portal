import {Inject, Injectable} from '@angular/core';
import {Observable, forkJoin} from 'rxjs';
import {ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {ApiService} from '../../../../core/api/api.service';
import {
  GetOnboardingOrganizationDetails,
  OnboardingProcessFormSubmit,
  Reset,
} from './organization-onboard-page-action';
import {
  DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE,
  OrganizationOnboardPageState,
} from './organization-onboard-page-state';

@State<OrganizationOnboardPageState>({
  name: 'OrganizationOnboardPageState',
  defaults: DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE,
})
@Injectable()
export class OrganizationOnboardPageStateImpl {
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private apiService: ApiService,
    private errorService: ErrorService,
    private actions$: Actions,
    private toast: ToastService,
  ) {}

  @Action(OnboardingProcessFormSubmit, {cancelUncompleted: true})
  onUpdateOrganization(
    ctx: StateContext<OrganizationOnboardPageState>,
    action: OnboardingProcessFormSubmit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();

    const onboardingUser$ = this.apiService.onboardingUser(
      action.request.userProfile,
    );
    const onboardingOrganization$ = this.apiService.onboardingOrganization(
      action.request.organizationProfile,
    );
    let requests: Observable<any>[] = [];
    if (action.onboardingType === 'USER_ONBOARDING') {
      requests = [onboardingUser$];
    } else {
      requests = [onboardingUser$, onboardingOrganization$];
    }

    return forkJoin(requests).pipe(
      tap(() => {
        this.toast.showSuccess(`Onboarding completed successfully`);
        ctx.patchState({state: 'success'});
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Onboarding Failed', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }

  @Action(GetOnboardingOrganizationDetails, {cancelUncompleted: true})
  onGetOrganization(
    ctx: StateContext<OrganizationOnboardPageState>,
  ): Observable<never> {
    return this.apiService.getMyOrganizationDetails().pipe(
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organization) => {
        this.organizationRefreshed(ctx, organization);
      }),
      ignoreElements(),
    );
  }

  private organizationRefreshed(
    ctx: StateContext<OrganizationOnboardPageState>,
    organization: Fetched<OwnOrganizationDetailsDto>,
  ) {
    ctx.patchState({
      ...ctx.getState(),
      organization,
    });
  }
}
