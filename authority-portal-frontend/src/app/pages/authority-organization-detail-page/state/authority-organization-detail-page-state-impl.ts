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
import {EMPTY, Observable, forkJoin} from 'rxjs';
import {
  filter,
  finalize,
  ignoreElements,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, Selector, State, StateContext} from '@ngxs/store';
import {OrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {SlideOverService} from 'src/app/shared/services/slide-over.service';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {RefreshOrganizations} from '../../authority-organization-list-page/state/authority-organization-list-page-actions';
import {
  ApproveOrganization,
  DeactivateUser,
  ReactivateUser,
  RefreshOrganization,
  RefreshOrganizationUser,
  RejectOrganization,
  SetOrganizationMdsId,
  SetOrganizationUserId,
} from './authority-organization-detail-page-actions';
import {
  AuthorityOrganizationDetailPageState,
  AuthorityOrganizationDetailState,
  AuthorityOrganizationUserDetailState,
  DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE,
  DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_STATE,
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
    private globalStateUtils: GlobalStateUtils,
    private slideOverService: SlideOverService,
  ) {}

  // Organization  State Implementation

  @Action(SetOrganizationMdsId)
  onSetOrganizationMdsId(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: SetOrganizationMdsId,
  ): Observable<never> {
    ctx.patchState({
      organizationDetail: {
        ...DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_STATE,
        organizationMdsId: action.organizationMdsId,
      },
    });

    return EMPTY;
  }

  @Action(RefreshOrganization, {cancelUncompleted: true})
  onRefreshOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getOrganizationDetailsForAuthority(
          ctx.getState().organizationDetail.organizationMdsId,
          deploymentEnvironmentId,
        ),
      ),
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organization) => this.organizationRefreshed(ctx, organization)),
      ignoreElements(),
    );
  }

  private organizationRefreshed(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    organization: Fetched<OrganizationDetailsDto>,
  ) {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationDetail.organization',
      organization,
    );
  }

  @Action(ApproveOrganization)
  onApproveOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: ApproveOrganization,
  ): Observable<never> {
    if (ctx.getState().organizationDetail.busy) {
      return EMPTY;
    }
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationDetail.busy',
      true,
    );

    return forkJoin([
      this.apiService.approveOrganization(
        ctx.getState().organizationDetail.organizationMdsId,
      ),
      this.globalStateUtils.getDeploymentEnvironmentId(),
    ]).pipe(
      switchMap(([res, deploymentEnvironmentId]) =>
        this.apiService.getOrganizationDetailsForAuthority(
          ctx.getState().organizationDetail.organizationMdsId,
          deploymentEnvironmentId,
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
        ctx.dispatch(new RefreshOrganizations());
        this.toast.showSuccess(
          `Organization ${
            ctx.getState().organizationDetail.organizationMdsId
          } was successfully approved`,
        );
      }),
      finalize(() =>
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationDetail.busy',
          false,
        ),
      ),
      ignoreElements(),
    );
  }

  @Action(RejectOrganization)
  onRejectOrganization(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: RejectOrganization,
  ): Observable<never> {
    if (ctx.getState().organizationDetail.busy) {
      return EMPTY;
    }
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationDetail.busy',
      true,
    );
    return forkJoin([
      this.apiService.rejectOrganization(
        ctx.getState().organizationDetail.organizationMdsId,
      ),
      this.globalStateUtils.getDeploymentEnvironmentId(),
    ]).pipe(
      switchMap(([res, deploymentEnvironmentId]) =>
        this.apiService.getOrganizationDetailsForAuthority(
          ctx.getState().organizationDetail.organizationMdsId,
          deploymentEnvironmentId,
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
            ctx.getState().organizationDetail.organizationMdsId
          } was successfully rejected`,
        );
        this.organizationRefreshed(ctx, Fetched.ready(data));
        ctx.dispatch(new RefreshOrganizations());
      }),
      finalize(() =>
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationDetail.busy',
          false,
        ),
      ),
      ignoreElements(),
    );
  }

  // Organization Currently Opened User Detail State Implementation

  @Action(SetOrganizationUserId)
  onSetOrganizationUserId(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: SetOrganizationUserId,
  ): Observable<never> {
    ctx.patchState({
      openedUserDetail: {
        ...DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE.openedUserDetail,
        organizationMdsId: action.organizationMdsId,
        userId: action.userId,
      },
    });
    return EMPTY;
  }

  @Action(RefreshOrganizationUser, {cancelUncompleted: true})
  onRefreshOrganizationUser(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
  ): Observable<never> {
    return this.apiService
      .getOrganizationUser(ctx.getState().openedUserDetail.userId)
      .pipe(
        Fetched.wrap({failureMessage: 'Failed loading user'}),
        tap((user) => this.organizationUserRefreshed(ctx, user)),
        ignoreElements(),
      );
  }

  private organizationUserRefreshed(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    user: Fetched<any>,
  ) {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'openedUserDetail.user',
      user,
    );
  }

  @Action(DeactivateUser)
  onDeactivateUser(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: DeactivateUser,
  ) {
    if (ctx.getState().openedUserDetail.busy) {
      return EMPTY;
    }
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'openedUserDetail.busy',
      true,
    );
    return this.apiService.deactivateAnyUser(action.userId).pipe(
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof RefreshOrganizationUser),
        ),
      ),
      this.errorService.toastFailureRxjs('Failed deactivating user'),
      tap((data) => {
        this.toast.showSuccess(`User deactivated successfully`);
        this.organizationUserRefreshed(ctx, Fetched.ready(data));
      }),
      finalize(() =>
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'openedUserDetail.busy',
          false,
        ),
      ),
      ignoreElements(),
    );
  }

  @Action(ReactivateUser)
  onReactivateUser(
    ctx: StateContext<AuthorityOrganizationDetailPageState>,
    action: ReactivateUser,
  ) {
    if (ctx.getState().openedUserDetail.busy) {
      return EMPTY;
    }
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'openedUserDetail.busy',
      false,
    );
    return this.apiService.reactivateAnyUser(action.userId).pipe(
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof RefreshOrganizationUser),
        ),
      ),
      this.errorService.toastFailureRxjs('Failed re-activating user'),
      tap((data) => {
        this.toast.showSuccess(`User re-activated successfully`);
        this.organizationUserRefreshed(ctx, Fetched.ready(data));
      }),
      finalize(() =>
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'openedUserDetail.busy',
          false,
        ),
      ),
      ignoreElements(),
    );
  }

  @Selector()
  static organizationDetailState(
    state: AuthorityOrganizationDetailPageState,
  ): AuthorityOrganizationDetailState {
    return state.organizationDetail;
  }

  @Selector()
  static openedUserDetailState(
    state: AuthorityOrganizationDetailPageState,
  ): AuthorityOrganizationUserDetailState {
    return state.openedUserDetail;
  }
}
