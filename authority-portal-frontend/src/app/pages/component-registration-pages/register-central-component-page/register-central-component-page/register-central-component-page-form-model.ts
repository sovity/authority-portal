import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {
  CertificateFormModel,
  DEFAULT_CERTIFICATE_FORM_VALUE,
} from '../../../../common/components/form-elements/certificate-input-form/certificate-input-form-model';

export interface ComponentTabFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  frontendUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
}

export type ComponentTabFormValue = ɵFormGroupRawValue<ComponentTabFormModel>;
export const DEFAULT_COMPONENT_TAB_FORM_VALUE: ComponentTabFormValue = {
  name: '',
  location: '',
  frontendUrl: '',
  endpointUrl: '',
};

export interface CertificateTabFormModel extends CertificateFormModel {}

export type CertificateTabFormValue =
  ɵFormGroupRawValue<CertificateTabFormModel>;
export const DEFAULT_CERTIFICATE_TAB_FORM_VALUE: CertificateTabFormValue =
  DEFAULT_CERTIFICATE_FORM_VALUE;

export interface RegisterCentralComponentPageFormModel {
  componentTab: FormGroup<ComponentTabFormModel>;
  certificateTab: FormGroup<CertificateTabFormModel>;
  canSwitchTabs: FormControl<boolean>;
}

export const DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_FORM_VALUE: RegisterCentralComponentPageFormValue =
  {
    componentTab: DEFAULT_COMPONENT_TAB_FORM_VALUE,
    certificateTab: DEFAULT_CERTIFICATE_TAB_FORM_VALUE,
    canSwitchTabs: true,
  };
export type RegisterCentralComponentPageFormValue =
  ɵFormGroupRawValue<RegisterCentralComponentPageFormModel>;
