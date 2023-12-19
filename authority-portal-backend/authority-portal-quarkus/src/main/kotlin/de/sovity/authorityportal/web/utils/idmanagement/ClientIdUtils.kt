package de.sovity.authorityportal.web.utils.idmanagement

import jakarta.enterprise.context.ApplicationScoped
import org.bouncycastle.cert.jcajce.JcaX509ExtensionUtils
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate

@ApplicationScoped
class ClientIdUtils {

    fun generateClientId(certString: String): String {
        val certInputStream = certString.byteInputStream()
        val certFactory = CertificateFactory.getInstance("X.509")
        val cert = certFactory.generateCertificate(certInputStream) as X509Certificate

        val extUtils = JcaX509ExtensionUtils()

        val ski = extUtils.createSubjectKeyIdentifier(cert.publicKey)
        val skiHex = ski.keyIdentifier.toHexString()

        val aki = extUtils.createAuthorityKeyIdentifier(cert.publicKey)
        val akiHex = aki.keyIdentifier.toHexString()

        return "$skiHex:keyid:$akiHex"
    }

    private fun ByteArray.toHexString(): String {
        return this.joinToString(":") { String.format("%02X", it) }
    }
}
