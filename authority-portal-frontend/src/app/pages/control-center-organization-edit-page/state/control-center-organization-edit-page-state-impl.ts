import {Injectable} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {CustomRxjsOperators} from '../../../core/custom-rxjs-operators';
import {Fetched} from '../../../core/utils/fetched';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';
import {ControlCenterOrganizationEditPageForm} from '../control-center-organization-edit-page/control-center-organization-edit-page.form';
import {
  buildEditRequest,
  buildFormValue,
} from '../control-center-organization-edit-page/control-center-organization-edit-page.form-mapper';
import {Reset, Submit} from './control-center-organization-edit-page-action';
import {
  ControlCenterOrganizationEditPageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_EDIT_PAGE_STATE,
} from './control-center-organization-edit-page-state';

type Ctx = StateContext<ControlCenterOrganizationEditPageState>;

@State<ControlCenterOrganizationEditPageState>({
  name: 'ControlCenterOrganizationEditPageState',
  defaults: DEFAULT_CONTROL_CENTER_ORGANIZATION_EDIT_PAGE_STATE,
})
@Injectable()
export class ControlCenterOrganizationEditPageStateImpl {
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private customRxjsOperators: CustomRxjsOperators,
  ) {}

  @Action(Reset, {cancelUncompleted: true})
  onReset(ctx: Ctx, action: Reset): Observable<never> {
    return this.apiService.getOwnOrganizationDetails().pipe(
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((organization) => {
        ctx.patchState({
          organization,
          headerBarConfig: organization
            .map((data) => this.buildHeaderBarConfig(data))
            .orElse(null),
        });
        action.setFormInComponent(
          organization.map((data) => this.rebuildForm(data)).orElse(null),
        );
      }),
      ignoreElements(),
    );
  }

  @Action(Submit)
  onSubmit(ctx: Ctx, action: Submit): Observable<never> {
    const request = buildEditRequest(action.formValue);
    return this.apiService
      .updateOwnOrganizationDetails(request)
      .pipe(
        this.customRxjsOperators.withBusyLock(ctx),
        this.customRxjsOperators.withToastResultHandling(
          'Editing own organization',
        ),
        this.customRxjsOperators.onSuccessRedirect([
          '/control-center/my-organization',
        ]),
        ignoreElements(),
      );
  }

  private buildHeaderBarConfig(
    organization: OwnOrganizationDetailsDto,
  ): HeaderBarConfig {
    return {
      title: organization.name,
      subtitle: 'Edit Your Organization Profile',
      headerActions: [],
    };
  }

  private rebuildForm(
    data: OwnOrganizationDetailsDto,
  ): ControlCenterOrganizationEditPageForm {
    const formValue = buildFormValue(data);
    return new ControlCenterOrganizationEditPageForm(
      this.formBuilder,
      formValue,
    );
  }
}
