import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {urlValidator} from 'src/app/core/utils/validators/url-validator';
import {
  CertificateFormModelValue,
  DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE,
  ProvideConnectorPageFormValue,
  ProvideConnectorParentFormGroup,
} from './provide-connector-page-form-model';

@Injectable()
export class ProvideConnectorForm {
  formGroup = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<ProvideConnectorParentFormGroup> {
    const initial = DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE;

    return this.formBuilder.nonNullable.group({
      connectorDetails: this.formBuilder.nonNullable.group({
        name: [initial.name, [Validators.required]],
        location: [initial.location, [Validators.required]],
        frontendUrl: [
          initial.frontendUrl,
          [Validators.required, urlValidator()],
        ],
        endpointUrl: [
          initial.endpointUrl,
          [Validators.required, urlValidator()],
        ],
        managementUrl: [
          initial.managementUrl,
          [Validators.required, urlValidator()],
        ],
        mdsId: [initial.mdsId, [Validators.required]],
      }),
      certificate: this.formBuilder.nonNullable.group({
        certificate: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(-----BEGIN CERTIFICATE-----)[\s\S]*?(-----END CERTIFICATE-----)\s*$/m,
            ),
          ],
        ],
      }),
    });
  }

  get connectorDetailsValue(): ProvideConnectorPageFormValue {
    return this.formGroup.controls['connectorDetails']
      .value as ProvideConnectorPageFormValue;
  }

  get certificateValue(): CertificateFormModelValue {
    return this.formGroup.controls['certificate']
      .value as CertificateFormModelValue;
  }
}
