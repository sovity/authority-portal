import {FormBuilder, FormGroup} from '@angular/forms';
import {buildUserEditForm} from '../../../shared/components/business/user-edit-form/user-edit-form-builder';
import {
  ControlCenterUserEditPageFormModel,
  ControlCenterUserEditPageFormValue,
} from './control-center-user-edit-page.form-model';

export class ControlCenterUserEditPageForm {
  group = this.buildFormGroup();

  get value(): ControlCenterUserEditPageFormValue {
    return this.group.value as ControlCenterUserEditPageFormValue;
  }

  constructor(
    private formBuilder: FormBuilder,
    private initialFormValue: ControlCenterUserEditPageFormValue,
  ) {}

  buildFormGroup(): FormGroup<ControlCenterUserEditPageFormModel> {
    return buildUserEditForm(this.formBuilder, this.initialFormValue);
  }
}
