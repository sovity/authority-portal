import {Inject, Injectable} from '@angular/core';
import {Observable, forkJoin} from 'rxjs';
import {ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {ApiService} from '../../../core/api/api.service';
import {
  GetOnboardingOrganizationDetails,
  OnboardingProcessFormSubmit,
  Reset,
} from './onboarding-process-wizard-page-action';
import {
  DEFAULT_ONBOARDING_PROCESS_WIZARD_PAGE_STATE,
  OnboardingProcessWizardPageState,
} from './onboarding-process-wizard-page-state';

@State<OnboardingProcessWizardPageState>({
  name: 'OnboardingProcessWizardPageState',
  defaults: DEFAULT_ONBOARDING_PROCESS_WIZARD_PAGE_STATE,
})
@Injectable()
export class OnboardingProcessWizardPageStateImpl {
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private apiService: ApiService,
    private errorService: ErrorService,
    private actions$: Actions,
    private toast: ToastService,
  ) {}

  @Action(OnboardingProcessFormSubmit, {cancelUncompleted: true})
  onUpdateOrganization(
    ctx: StateContext<OnboardingProcessWizardPageState>,
    action: OnboardingProcessFormSubmit,
  ): Observable<never> {
    ctx.patchState({onboardingFormState: 'submitting'});
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
        ctx.patchState({onboardingFormState: 'success'});
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Onboarding Failed', () => {
        ctx.patchState({onboardingFormState: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }

  @Action(GetOnboardingOrganizationDetails, {cancelUncompleted: true})
  onGetOrganization(
    ctx: StateContext<OnboardingProcessWizardPageState>,
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
    ctx: StateContext<OnboardingProcessWizardPageState>,
    organization: Fetched<OwnOrganizationDetailsDto>,
  ) {
    ctx.patchState({
      ...ctx.getState(),
      organization,
    });
  }
}
