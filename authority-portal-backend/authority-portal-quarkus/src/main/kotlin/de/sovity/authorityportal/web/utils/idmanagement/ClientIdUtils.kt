package de.sovity.authorityportal.web.utils.idmanagement

import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.bouncycastle.cert.jcajce.JcaX509ExtensionUtils
import org.jooq.DSLContext
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate

@ApplicationScoped
class ClientIdUtils {
    @Inject
    lateinit var dsl: DSLContext

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

    fun exists(clientId: String): Boolean {
        val c = Tables.CONNECTOR
        val connectorClientIds = dsl.select(c.CLIENT_ID.`as`("clientId"))
            .from(c)
            .where(c.CLIENT_ID.eq(clientId))

        val cmp = Tables.COMPONENT
        val centralComponentClientIds = dsl.select(cmp.CLIENT_ID.`as`("clientId"))
            .from(cmp)
            .where(cmp.CLIENT_ID.eq(clientId))

        return dsl.fetchExists(connectorClientIds.unionAll(centralComponentClientIds))
    }

    private fun ByteArray.toHexString(): String {
        return this.joinToString(":") { String.format("%02X", it) }
    }
}
