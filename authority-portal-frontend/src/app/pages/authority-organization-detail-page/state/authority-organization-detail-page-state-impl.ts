import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {
  filter,
  finalize,
  ignoreElements,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {OrganizationDetailResult} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  ApproveOrganization,
  RefreshOrganization,
  RejectOrganization,
  SetOrganizationMdsId,
} from './authority-organization-detail-page-actions';
import {
  AuthorityOrganizationDetailPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE,
} from './authority-organization-detail-page-state';

@State<AuthorityOrganizationDetailPageState>({
  name: 'AuthorityOrganizationDetailPageState',
  defaults: DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE,
})
@Injectable()
export class AuthorityOrganizationDetailPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private errorService: ErrorService,
    private toast: ToastService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  @Action(SetOrganizationMdsId)
  onSetOrganizationMdsId(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: SetOrganizationMdsId,
  ): Observable<never> {
    ctx.patchState({organizationMdsId: action.organizationMdsId});
    return EMPTY;
  }

  @Action(RefreshOrganization, {cancelUncompleted: true})
  onRefreshOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: RefreshOrganization,
  ): Observable<never> {
    return this.apiService
      .getOrganizationDetails(ctx.getState().organizationMdsId)
      .pipe(
        Fetched.wrap({failureMessage: 'Failed loading organizations'}),
        tap((organization) => this.organizationRefreshed(ctx, organization)),
        ignoreElements(),
      );
  }

  private organizationRefreshed(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    organization: Fetched<OrganizationDetailResult>,
  ) {
    ctx.patchState({organization});
  }

  @Action(ApproveOrganization)
  onApproveOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: ApproveOrganization,
  ): Observable<never> {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});
    return this.apiService
      .approveOrganization(ctx.getState().organizationMdsId)

      .pipe(
        switchMap(() =>
          this.apiService.getOrganizationDetails(
            ctx.getState().organizationMdsId,
          ),
        ),
        takeUntil(
          this.actions$.pipe(
            filter((action) => action instanceof RefreshOrganization),
          ),
        ),
        this.errorService.toastFailureRxjs("Organization wasn't approved"),
        tap((data) => {
          this.organizationRefreshed(ctx, Fetched.ready(data));
          this.toast.showSuccess(
            `Organization ${
              ctx.getState().organizationMdsId
            } was successfully approved`,
          );
          this.router.navigate(['/authority', 'organizations']);
        }),
        finalize(() => ctx.patchState({busy: false})),
        ignoreElements(),
      );
  }

  @Action(RejectOrganization)
  onRejectOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: RejectOrganization,
  ): Observable<never> {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});
    return this.apiService
      .rejectOrganization(ctx.getState().organizationMdsId)
      .pipe(
        switchMap(() =>
          this.apiService.getOrganizationDetails(
            ctx.getState().organizationMdsId,
          ),
        ),
        takeUntil(
          this.actions$.pipe(
            filter((action) => action instanceof RefreshOrganization),
          ),
        ),
        this.errorService.toastFailureRxjs("Organization wasn't rejected"),
        tap((data) => {
          this.toast.showSuccess(
            `Organization ${
              ctx.getState().organizationMdsId
            } was successfully rejected`,
          );
          this.organizationRefreshed(ctx, Fetched.ready(data));

          this.router.navigate(['/authority', 'organizations']);
        }),
        finalize(() => ctx.patchState({busy: false})),
        ignoreElements(),
      );
  }
}
