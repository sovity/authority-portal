import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface RequestConnectorFormModel {
  connectorTitle: FormControl<string>;
  connectorSubdomain: FormControl<string>;
  connectorDescription: FormControl<string>;
}

export const DEFAULT_REQUEST_CONNECTOR_FORM_VALUE: RequestConnectorFormValue = {
  connectorTitle: '',
  connectorSubdomain: '',
  connectorDescription: '',
};

export type RequestConnectorFormValue =
  ɵFormGroupRawValue<RequestConnectorFormModel>;
