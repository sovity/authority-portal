import {FormControl, ɵFormGroupValue} from '@angular/forms';

export type ProvideConnectorPageFormValue =
  ɵFormGroupValue<ProvideConnectorPageFormModel>;

export interface ProvideConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  url: FormControl<string>;
  mdsId: FormControl<string>;
  certificate: FormControl<string>;
}
