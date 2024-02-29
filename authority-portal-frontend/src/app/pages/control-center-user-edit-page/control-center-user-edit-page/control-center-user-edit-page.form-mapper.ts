import {
  OwnOrganizationDetailsDto,
  UpdateOrganizationDto,
  UpdateUserDto,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {ControlCenterUserEditPageFormValue} from './control-center-user-edit-page.form-model';

export function buildFormValue(
  user: UserDetailDto,
): ControlCenterUserEditPageFormValue {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    jobTitle: user.position,
    phoneNumber: user.phone,
  };
}

export function buildEditRequest(
  formValue: ControlCenterUserEditPageFormValue,
): UpdateUserDto {
  return {
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    email: formValue.email,
    jobTitle: formValue.jobTitle,
    phone: formValue.phoneNumber,
  };
}
