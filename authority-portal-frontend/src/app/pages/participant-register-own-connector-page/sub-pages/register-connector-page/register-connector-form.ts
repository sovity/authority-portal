import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {certificateValidator} from '../../../../core/utils/validators/certificate-validator';
import {urlValidator} from '../../../../core/utils/validators/url-validator';
import {
  CertificateFormModelValue,
  DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE,
  ParticipantRegisterOwnConnectorPageFormValue,
  RegisterConnectorParentFormGroup,
} from '../../participant-register-own-connector-page/participant-register-own-connector-page-form-model';

@Injectable()
export class RegisterConnectorForm {
  formGroup = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RegisterConnectorParentFormGroup> {
    const initial = DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE;

    return this.formBuilder.nonNullable.group({
      connectorDetails: this.formBuilder.nonNullable.group({
        name: [initial.name, [Validators.required]],
        location: [initial.location, [Validators.required]],
        frontendUrl: [initial.frontendUrl, [Validators.required, urlValidator]],
        endpointUrl: [initial.endpointUrl, [Validators.required, urlValidator]],
        managementUrl: [
          initial.managementUrl,
          [Validators.required, urlValidator],
        ],
      }),
      certificate: this.formBuilder.nonNullable.group({
        certificate: ['', [Validators.required, certificateValidator]],
      }),
    });
  }

  get connectorDetailsValue(): ParticipantRegisterOwnConnectorPageFormValue {
    return this.formGroup.controls.connectorDetails
      .value as ParticipantRegisterOwnConnectorPageFormValue;
  }

  get certificateValue(): CertificateFormModelValue {
    return this.formGroup.controls.certificate
      .value as CertificateFormModelValue;
  }
}
