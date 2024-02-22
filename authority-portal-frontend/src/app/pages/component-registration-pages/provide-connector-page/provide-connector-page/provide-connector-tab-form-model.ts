import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {
  CertificateFormModel,
  DEFAULT_CERTIFICATE_FORM_VALUE,
} from '../../../../common/components/form-elements/certificate-input-form/certificate-input-form-model';

export interface ProvideConnectorTabFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  frontendUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
  managementUrl: FormControl<string>;
  organization: FormControl<OrganizationOverviewEntryDto | null>;
}
export type ProvideConnectorTabFormValue =
  ɵFormGroupRawValue<ProvideConnectorTabFormModel>;
export const DEFAULT_CONNECTOR_TAB_FORM_VALUE: ProvideConnectorTabFormValue = {
  name: '',
  location: '',
  frontendUrl: '',
  endpointUrl: '',
  managementUrl: '',
  organization: null,
};

export interface ProvideCertificateTabFormModel extends CertificateFormModel {}
export type ProvideCertificateTabFormValue =
  ɵFormGroupRawValue<ProvideCertificateTabFormModel>;
export const DEFAULT_CERTIFICATE_TAB_FORM_VALUE: ProvideCertificateTabFormValue =
  DEFAULT_CERTIFICATE_FORM_VALUE;

export interface ProvideWizardFormModel {
  connectorTab: FormGroup<ProvideConnectorTabFormModel>;
  certificateTab: FormGroup<ProvideCertificateTabFormModel>;
  canSwitchTabs: FormControl<boolean>;
}
export const DEFAULT_PROVIDE_WIZARD_FORM_VALUE: ProvideWizardFormValue = {
  connectorTab: DEFAULT_CONNECTOR_TAB_FORM_VALUE,
  certificateTab: DEFAULT_CERTIFICATE_TAB_FORM_VALUE,
  canSwitchTabs: true,
};
export type ProvideWizardFormValue = ɵFormGroupRawValue<ProvideWizardFormModel>;
