import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  DEFAULT_GENERATE_CERTIFICATE_FORM_VALUE,
  DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE,
  GenerateCertificateFormModel,
  GenerateCertificateFormValue,
  ParticipantRegisterOwnConnectorPageFormModel,
  ParticipantRegisterOwnConnectorPageFormValue,
} from '../../participant-register-own-connector-page/participant-register-own-connector-page-form-model';

interface RegisterConnectorParentForm {
  connectorDetails: FormGroup<ParticipantRegisterOwnConnectorPageFormModel>;
  certificate: FormGroup<GenerateCertificateFormModel>;
}
@Injectable()
export class RegisterConnectorForm {
  formGroup = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RegisterConnectorParentForm> {
    const initial = DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE;
    const initialCertificate = DEFAULT_GENERATE_CERTIFICATE_FORM_VALUE;
    return this.formBuilder.nonNullable.group({
      connectorDetails: this.formBuilder.nonNullable.group({
        name: [initial.name, [Validators.required]],
        location: [initial.location, [Validators.required]],
        url: [
          initial.url,
          [Validators.required, Validators.pattern(/^https:\/\/[^\s]+$/)],
        ],
        certificate: [initial.certificate, []],
      }),
      certificate: this.formBuilder.nonNullable.group({
        country: [initialCertificate.country, [Validators.required]],
        state: [initialCertificate.state, [Validators.required]],
        city: [initialCertificate.city, [Validators.required]],
        organizationalUnit: [
          initialCertificate.organizationalUnit,
          [Validators.required],
        ],
        commonName: [initialCertificate.commonName, [Validators.required]],
        certificate: [
          {value: initialCertificate.certificate, disabled: true},
          [],
        ],
      }),
    });
  }

  get connectorDetailsValue(): ParticipantRegisterOwnConnectorPageFormValue {
    return this.formGroup.controls['connectorDetails']
      .value as ParticipantRegisterOwnConnectorPageFormValue;
  }

  get certificateValue(): GenerateCertificateFormValue {
    return this.formGroup.controls['certificate']
      .value as GenerateCertificateFormValue;
  }
}
