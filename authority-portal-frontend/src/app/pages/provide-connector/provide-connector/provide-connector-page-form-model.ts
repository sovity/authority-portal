import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type ProvideConnectorPageFormValue =
  ɵFormGroupRawValue<ProvideConnectorPageFormModel>;

export interface ProvideConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  url: FormControl<string>;
  mdsId: FormControl<string>;
  certificate: FormControl<string>;
  environmentId: FormControl<string>;
}

export const DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE: ProvideConnectorPageFormValue =
  {
    name: '',
    location: '',
    url: '',
    mdsId: '',
    certificate: '',
    environmentId: '',
  };
