import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type CentralComponentCreatePageFormValue =
  ɵFormGroupRawValue<CentralComponentCreatePageFormModel>;

export interface CentralComponentCreatePageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  homepageUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
  certificate: FormControl<string>;
}

export const DEFAULT_CENTRAL_COMPONENT_CREATE_FORM_VALUE: CentralComponentCreatePageFormValue =
  {
    name: '',
    location: '',
    homepageUrl: '',
    endpointUrl: '',
    certificate: '',
  };
