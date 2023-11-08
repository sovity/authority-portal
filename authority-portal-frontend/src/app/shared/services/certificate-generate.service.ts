import {Injectable} from '@angular/core';
import * as forge from 'node-forge';

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
}
