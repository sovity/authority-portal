import {ɵFormGroupRawValue} from '@angular/forms';
import {OrganizationEditFormModel} from '../../../shared/components/business/organization-edit-form/organization-edit-form-model';

export interface ControlCenterOrganizationEditPageFormModel
  extends OrganizationEditFormModel {}

export type ControlCenterOrganizationEditPageFormValue =
  ɵFormGroupRawValue<ControlCenterOrganizationEditPageFormModel>;
