import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {certificateValidator} from '../../../../core/utils/validators/certificate-validator';
import {passwordEntropyValidator} from '../../../../core/utils/validators/password-entropy-validator';
import {passwordMatchValidator} from '../../../../core/utils/validators/password-match-validator';
import {
  CertificateFormModel,
  CertificateFormValue,
} from './certificate-input-form-model';

export const buildCertificateInputForm = (
  formBuilder: FormBuilder,
  initial: CertificateFormValue,
): FormGroup<CertificateFormModel> =>
  formBuilder.nonNullable.group(
    {
      bringOwnCert: [initial.bringOwnCert],
      ownCertificate: [
        initial.ownCertificate,
        [Validators.required, certificateValidator],
      ],
      organizationalUnit: [initial.organizationalUnit, [Validators.required]],
      email: [initial.email, [Validators.required, Validators.email]],
      state: [initial.state, [Validators.required]],
      city: [initial.city, [Validators.required]],
      password: [
        initial.password,
        [
          Validators.required,
          Validators.minLength(8),
          passwordEntropyValidator,
        ],
      ],
      confirmPassword: [initial.confirmPassword, [Validators.required]],
      generatedCertificate: [
        initial.generatedCertificate,
        [Validators.required],
      ],
    },
    {validators: passwordMatchValidator('password', 'confirmPassword')},
  );
