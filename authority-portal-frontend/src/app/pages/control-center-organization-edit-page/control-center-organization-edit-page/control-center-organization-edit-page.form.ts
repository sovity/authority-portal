import {FormBuilder, FormGroup} from '@angular/forms';
import {switchDisabledControls} from '../../../core/utils/form-utils';
import {buildOrganizationEditForm} from '../../../shared/components/business/organization-edit-form/organization-edit-form-builder';
import {organizationEditFormEnabledCtrls} from '../../../shared/components/business/organization-edit-form/organization-edit-form-enabled-ctrls';
import {
  ControlCenterOrganizationEditPageFormModel,
  ControlCenterOrganizationEditPageFormValue,
} from './control-center-organization-edit-page.form-model';

export class ControlCenterOrganizationEditPageForm {
  group = this.buildFormGroup();

  get value(): ControlCenterOrganizationEditPageFormValue {
    return this.group.value as ControlCenterOrganizationEditPageFormValue;
  }

  constructor(
    private formBuilder: FormBuilder,
    private initialFormValue: ControlCenterOrganizationEditPageFormValue,
  ) {}

  buildFormGroup(): FormGroup<ControlCenterOrganizationEditPageFormModel> {
    const group: FormGroup<ControlCenterOrganizationEditPageFormModel> =
      buildOrganizationEditForm(this.formBuilder, this.initialFormValue);

    switchDisabledControls<ControlCenterOrganizationEditPageFormValue>(
      group,
      (value: ControlCenterOrganizationEditPageFormValue) =>
        organizationEditFormEnabledCtrls(value),
    );

    return group;
  }
}
