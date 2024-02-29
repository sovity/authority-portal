import {ControlCenterUserEditPageForm} from '../control-center-user-edit-page/control-center-user-edit-page.form';
import {ControlCenterUserEditPageFormValue} from '../control-center-user-edit-page/control-center-user-edit-page.form-model';

const tag = 'ControlCenterUserEditPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;

  constructor(
    /**
     * Function for setting the form. This is required because the form won't survive being frozen as all state values are
     */
    public setFormInComponent: (
      form: ControlCenterUserEditPageForm | null,
    ) => void,
  ) {}
}

export class Submit {
  static readonly type = `[${tag}] Submit`;

  constructor(public formValue: ControlCenterUserEditPageFormValue) {}
}
