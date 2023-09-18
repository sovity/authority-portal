package de.sovity.authorityportal.web.services.utils.idmanagement

import jakarta.enterprise.context.ApplicationScoped
import org.bouncycastle.asn1.x509.AuthorityKeyIdentifier
import org.bouncycastle.asn1.x509.Extension
import org.bouncycastle.asn1.x509.SubjectKeyIdentifier
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate

@ApplicationScoped
class ClientIdUtils {

    fun generateClientId(certString: String): String {
        val certInputStream = certString.byteInputStream()
        val certFactory = CertificateFactory.getInstance("X.509")
        val cert = certFactory.generateCertificate(certInputStream) as X509Certificate // TODO: error?

        val certHolder = JcaX509CertificateHolder(cert)

        val skiExtension = certHolder.getExtension(Extension.subjectKeyIdentifier)
        val ski = SubjectKeyIdentifier.getInstance(skiExtension.parsedValue)
        val skiHex = ski.keyIdentifier.toHexString()

        val akiExtension = certHolder.getExtension(Extension.authorityKeyIdentifier)
        val aki = AuthorityKeyIdentifier.getInstance(akiExtension.parsedValue)
        val akiHex = aki.keyIdentifier.toHexString()

        return "$skiHex:keyid:$akiHex"
    }

    private fun ByteArray.toHexString(): String {
        return this.joinToString(":") { String.format("%02X", it) }
    }
}
