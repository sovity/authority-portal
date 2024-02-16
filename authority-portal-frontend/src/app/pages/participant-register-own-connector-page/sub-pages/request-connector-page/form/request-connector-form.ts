import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {subdomainValidators} from 'src/app/core/utils/validators/subdomain-validator';
import {
  DEFAULT_REQUEST_CONNECTOR_FORM_VALUE,
  RequestConnectorFormModel,
  RequestConnectorFormValue,
} from './request-connector-form-model';

@Injectable()
export class RequestConnectorForm {
  formGroup = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RequestConnectorFormModel> {
    const initial = DEFAULT_REQUEST_CONNECTOR_FORM_VALUE;

    return this.formBuilder.nonNullable.group({
      connectorTitle: [initial.connectorTitle, [Validators.required]],
      connectorSubdomain: [
        initial.connectorSubdomain,
        [Validators.required, ...subdomainValidators],
      ],
      connectorDescription: [
        initial.connectorDescription,
        [Validators.required],
      ],
    });
  }

  get getValue(): RequestConnectorFormValue {
    return this.formGroup.value as RequestConnectorFormValue;
  }
}
