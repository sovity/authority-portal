import {CertificateFormValue} from './certificate-input-form-model';

export const certificateInputFormEnabledCtrls = (
  value: CertificateFormValue,
): Record<keyof CertificateFormValue, boolean> => {
  let isOwnCert = value.bringOwnCert;
  return {
    bringOwnCert: true,
    ownCertificate: isOwnCert,

    organizationalUnit: !isOwnCert,
    email: !isOwnCert,
    state: !isOwnCert,
    city: !isOwnCert,
    password: !isOwnCert,
    confirmPassword: !isOwnCert,
    generatedCertificate: !isOwnCert,
  };
};
