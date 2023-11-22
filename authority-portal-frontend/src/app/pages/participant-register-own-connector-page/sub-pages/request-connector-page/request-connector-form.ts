import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  DEFAULT_CONNECTOR_REQUEST_FORM_VALUE,
  RequestConnectorFormModel,
  RequestConnectorFormValue,
} from './request-connector-page.model';

/**
 * Handles AngularForms for RequestConnectorPageComponent
 */
@Injectable()
export class RequestConnectorForm {
  group = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RequestConnectorFormModel> {
    const initial = DEFAULT_CONNECTOR_REQUEST_FORM_VALUE;
    return this.formBuilder.nonNullable.group({
      organizationName: [initial.organizationName, [Validators.required]],
      curator: [initial.curator, [Validators.required]],
      curatorEmail: [
        initial.curatorEmail,
        [Validators.required, Validators.email],
      ],
      subdomain: [
        initial.subdomain,
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/i,
          ),
        ],
      ],
    });
  }

  get value(): RequestConnectorFormValue {
    return this.group.value as RequestConnectorFormValue;
  }
}
