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
import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../../core/api/api.service';
import {CreateOrganization, Reset} from './organization-create-page-action';
import {
  DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE,
  OrganizationRegistrationPageState,
} from './organization-create-page-state';
import {HttpErrorResponse} from "@angular/common/http";

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
    ctx.patchState({email: action.request.userEmail});
    return this.apiService.registerOrganization(action.request).pipe(
      tap((res) => {
        this.toast.showSuccess(`Successfully registered.`);
        ctx.patchState({state: 'success'});
        ctx.patchState({id: res.id ?? ''});
        action.success();
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      catchError((err) => {
        let errorMessage = 'Registration failed due to an unknown error.';
        console.log(err)
        console.log(err.status)
        if (err.status === 409) {
          errorMessage = 'This e-mail address is already registered.'
        }
        this.toast.showDanger(errorMessage);
        ctx.patchState({state: 'error'});
        action.enableForm()
        return of(null);
      }),
      ignoreElements(),
    );
  }
}
