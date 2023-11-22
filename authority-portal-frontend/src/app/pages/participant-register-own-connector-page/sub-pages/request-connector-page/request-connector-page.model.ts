import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type RequestConnectorFormValue =
  ɵFormGroupRawValue<RequestConnectorFormModel>;

export interface RequestConnectorFormModel {
  organizationName: FormControl<string>;
  curator: FormControl<string>;
  curatorEmail: FormControl<string>;
  subdomain: FormControl<string>;
}

export const DEFAULT_CONNECTOR_REQUEST_FORM_VALUE: RequestConnectorFormValue = {
  organizationName: '',
  curator: '',
  curatorEmail: '',
  subdomain: '',
};
