import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface RequestConnectorPageFormModel {
  connectorTitle: FormControl<string>;
  connectorSubdomain: FormControl<string>;
  connectorDescription: FormControl<string>;
}

export type RequestConnectorPageFormValue =
  ɵFormGroupRawValue<RequestConnectorPageFormModel>;

export const DEFAULT_REQUEST_CONNECTOR_PAGE_FORM_VALUE: RequestConnectorPageFormValue =
  {
    connectorTitle: '',
    connectorSubdomain: '',
    connectorDescription: '',
  };
