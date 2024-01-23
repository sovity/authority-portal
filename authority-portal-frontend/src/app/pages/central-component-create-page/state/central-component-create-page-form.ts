import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {certificateValidator} from '../../../core/utils/validators/certificate-validator';
import {urlValidator} from '../../../core/utils/validators/url-validator';
import {
  CentralComponentCreatePageFormModel,
  CentralComponentCreatePageFormValue,
  DEFAULT_CENTRAL_COMPONENT_CREATE_FORM_VALUE,
} from './central-component-create-page-form-model';

@Injectable()
export class CentralComponentCreatePageForm {
  group = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  get value(): CentralComponentCreatePageFormValue {
    return this.group.value as CentralComponentCreatePageFormValue;
  }

  buildFormGroup(): FormGroup<CentralComponentCreatePageFormModel> {
    const initial = DEFAULT_CENTRAL_COMPONENT_CREATE_FORM_VALUE;
    return this.formBuilder.nonNullable.group({
      name: [initial.name, Validators.required],
      location: [initial.location, Validators.required],
      homepageUrl: [initial.homepageUrl, urlValidator],
      endpointUrl: [initial.endpointUrl, [Validators.required, urlValidator]],
      certificate: [
        initial.certificate,
        [Validators.required, certificateValidator],
      ],
    });
  }
}
