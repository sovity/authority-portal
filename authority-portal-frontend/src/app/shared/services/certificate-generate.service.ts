import {Injectable} from '@angular/core';
import * as forge from 'node-forge';

export interface CertificateAttributes {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class CertificateGenerateService {
  /**
   * generate key pair
   * @param bits
   * @returns
   */
  generateKeyPair(bits: number): forge.pki.rsa.KeyPair {
    return forge.pki.rsa.generateKeyPair({bits: bits});
  }

  /**
   * Generate a self signed Certificate based on the inputs
   * @param keyPair
   * @param attributes
   * @param validUntil
   * @returns
   */
  generateSelfSignedCertificate(
    keyPair: forge.pki.rsa.KeyPair,
    attributes: CertificateAttributes,
    validUntil: Date,
  ) {
    // Create a certificate
    const cert = forge.pki.createCertificate();
    cert.publicKey = keyPair.publicKey;

    // Set certificate fields
    cert.serialNumber = Date.now().toString(); // Set serial number to current Unix time;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = validUntil;

    let attrs: forge.pki.CertificateField[] = [
      {
        name: 'commonName',
        value: attributes['commonName'],
      },
      {
        name: 'countryName',
        value: attributes['countryName'],
      },
      {
        shortName: 'ST',
        value: attributes['stateName'],
      },
      {
        name: 'localityName',
        value: attributes['localityName'],
      },
      {
        name: 'organizationName',
        value: attributes['organizationName'],
      },
      {
        name: 'organizationalUnitName',
        value: attributes['organizationalUnitName'],
      },
      {
        name: 'emailAddress',
        value: attributes['emailAddress'],
      },
    ];

    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    // Sign the certificate with the key pair
    cert.sign(keyPair.privateKey);

    // Convert certificate to PEM format
    return cert;
  }

  certificateToPem(certificate: forge.pki.Certificate) {
    return forge.pki.certificateToPem(certificate);
  }

  /**
   * converts public key to pem format
   * @param publicKey
   * @returns
   */
  publicKeyToPem(publicKey: forge.pki.PublicKey) {
    return forge.pki.publicKeyToPem(publicKey);
  }

  /**
   * converts private key to pem format
   * @param privateKey
   * @returns
   */
  privateKeyToPem(privateKey: forge.pki.PrivateKey): string {
    return forge.pki.privateKeyToPem(privateKey);
  }

  convertToP12Format(
    privateKey: forge.pki.PrivateKey,
    certificate: forge.pki.Certificate,
    password: string,
  ) {
    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
      privateKey,
      [certificate],
      password,
    );
    const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    return btoa(p12Der);
  }

  getCertificateBlob(certificate: string) {
    try {
      const byteCharacters = atob(certificate);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/x-pkcs12'});

      return blob;
    } catch (error) {
      return null;
    }
  }
}
