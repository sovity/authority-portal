import {Injectable, NgZone} from '@angular/core';
import {EMPTY, Observable, concat} from 'rxjs';
import {
  catchError,
  filter,
  ignoreElements,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {OrganizationDetailResult} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  ApproveOrganization,
  RefreshOrganization,
  RejectOrganization,
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
  constructor(private apiService: ApiService, private actions$: Actions) {}

  @Action(RefreshOrganization, {cancelUncompleted: true})
  onRefreshOrganizations(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: RefreshOrganization,
  ): Observable<never> {
    return this.apiService.getOrganizationDetails(action.mdsId).pipe(
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organization) =>
        this.onOrganizationRefreshed(ctx, action.mdsId, organization),
      ),
      ignoreElements(),
    );
  }

  private onOrganizationRefreshed(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    organizationMdsId: string,
    organization: Fetched<OrganizationDetailResult>,
  ) {
    ctx.patchState({organizationMdsId, organization});
  }

  @Action(ApproveOrganization)
  onApproveOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: ApproveOrganization,
  ): Observable<never> {
    return this.apiService.approveOrganization(action.mdsId).pipe(
      switchMap(() =>
        this.apiService
          .getOrganizationDetails(ctx.getState().organizationMdsId)
          .pipe(
            takeUntil(
              this.actions$.pipe(
                filter((action) => action instanceof RefreshOrganization),
              ),
            ),
            catchError(() => EMPTY),
            tap((data) =>
              this.onOrganizationRefreshed(
                ctx,
                ctx.getState().organizationMdsId,
                Fetched.ready(data),
              ),
            ),
            ignoreElements(),
          ),
      ),
    );
  }

  @Action(RejectOrganization)
  onRejectOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: RejectOrganization,
  ): Observable<never> {
    return this.apiService.rejectOrganization(action.mdsId).pipe(
      switchMap(() =>
        this.apiService
          .getOrganizationDetails(ctx.getState().organizationMdsId)
          .pipe(
            takeUntil(
              this.actions$.pipe(
                filter((action) => action instanceof RefreshOrganization),
              ),
            ),
            catchError(() => EMPTY),
            tap((data) =>
              this.onOrganizationRefreshed(
                ctx,
                ctx.getState().organizationMdsId,
                Fetched.ready(data),
              ),
            ),
            ignoreElements(),
          ),
      ),
    );
  }
}
