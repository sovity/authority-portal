import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {subdomainValidators} from 'src/app/core/utils/validators/subdomain-validator';
import {
  DEFAULT_REQUEST_CONNECTOR_PAGE_FORM_VALUE,
  RequestConnectorPageFormModel,
  RequestConnectorPageFormValue,
} from './request-connector-page-form-model';

@Injectable()
export class RequestConnectorPageForm {
  formGroup = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RequestConnectorPageFormModel> {
    const initial = DEFAULT_REQUEST_CONNECTOR_PAGE_FORM_VALUE;

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

  get getValue(): RequestConnectorPageFormValue {
    return this.formGroup.value as RequestConnectorPageFormValue;
  }
}
