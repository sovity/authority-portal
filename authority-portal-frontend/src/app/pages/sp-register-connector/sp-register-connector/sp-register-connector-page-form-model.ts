import {FormControl, ɵFormGroupValue} from '@angular/forms';

export type SpRegisterConnectorPageFormValue =
  ɵFormGroupValue<SpRegisterConnectorPageFormModel>;

export interface SpRegisterConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  url: FormControl<string>;
  mdsId: FormControl<string>;
  certificate: FormControl<string>;
}
