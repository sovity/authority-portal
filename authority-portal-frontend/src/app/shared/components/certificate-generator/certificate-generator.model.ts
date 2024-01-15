export interface CertificateGeneratorConfig {
  country: string;
  legalName: string;
  commonName: string;
  email: string;
}

export interface CertificateResult {
  pemCertificate: string;
  p12FormatCertificate: string;
  certificateBlob: Blob | null;
}
