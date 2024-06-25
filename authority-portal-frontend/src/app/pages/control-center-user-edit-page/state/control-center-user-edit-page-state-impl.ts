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
import {FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {ignoreElements, switchMap, take, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {CustomRxjsOperators} from 'src/app/core/services/custom-rxjs-operators';
import {Fetched} from 'src/app/core/utils/fetched';
import {HeaderBarConfig} from '../../../shared/common/header-bar/header-bar.model';
import {ControlCenterUserEditPageForm} from '../control-center-user-edit-page/control-center-user-edit-page.form';
import {
  buildEditRequest,
  buildFormValue,
} from '../control-center-user-edit-page/control-center-user-edit-page.form-mapper';
import {Reset, Submit} from './control-center-user-edit-page-action';
import {
  ControlCenterUserEditPageState,
  DEFAULT_CONTROL_CENTER_USER_EDIT_PAGE_STATE,
} from './control-center-user-edit-page-state';

type Ctx = StateContext<ControlCenterUserEditPageState>;

@State<ControlCenterUserEditPageState>({
  name: 'ControlCenterUserEditPageState',
  defaults: DEFAULT_CONTROL_CENTER_USER_EDIT_PAGE_STATE,
})
@Injectable()
export class ControlCenterUserEditPageStateImpl {
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private customRxjsOperators: CustomRxjsOperators,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: Ctx, action: Reset): Observable<never> {
    return this.globalStateUtils.userInfo$.pipe(
      take(1),
      switchMap((userInfo) =>
        this.apiService.getUserDetailDto(userInfo.userId),
      ),
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((user) => {
        ctx.patchState({
          user,
          headerBarConfig: user
            .map((userDetails) => this.buildHeaderBarConfig(userDetails))
            .orElse(null),
        });
        action.setFormInComponent(
          user.map((data) => this.rebuildForm(data)).orElse(null),
        );
      }),
      ignoreElements(),
    );
  }

  @Action(Submit)
  onSubmit(ctx: Ctx, action: Submit): Observable<never> {
    const request = buildEditRequest(action.formValue);
    return this.apiService
      .updateUser(ctx.getState().user.data.userId, request)
      .pipe(
        this.customRxjsOperators.withBusyLock(ctx),
        this.customRxjsOperators.withToastResultHandling('Editing profile'),
        this.customRxjsOperators.onSuccessRedirect([
          '/control-center/my-profile',
        ]),
        ignoreElements(),
      );
  }

  private buildHeaderBarConfig(user: UserDetailDto): HeaderBarConfig {
    return {
      title: `${user.firstName} ${user.lastName}`,
      subtitle: 'Edit Your Profile Information',
      headerActions: [],
    };
  }
  private rebuildForm(data: UserDetailDto): ControlCenterUserEditPageForm {
    const formValue = buildFormValue(data);
    return new ControlCenterUserEditPageForm(this.formBuilder, formValue);
  }
}
