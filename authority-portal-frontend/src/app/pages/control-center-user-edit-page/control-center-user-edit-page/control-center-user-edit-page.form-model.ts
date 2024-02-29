import {ɵFormGroupRawValue} from '@angular/forms';
import {UserEditFormModel} from '../../../shared/components/business/user-edit-form/user-edit-form-model';

export interface ControlCenterUserEditPageFormModel extends UserEditFormModel {}

export type ControlCenterUserEditPageFormValue =
  ɵFormGroupRawValue<ControlCenterUserEditPageFormModel>;
