package de.sovity.authorityportal.web.thirdparty.daps

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.DapsConfig
import de.sovity.authorityportal.web.thirdparty.daps.ext.CustomKeycloakResource
import de.sovity.authorityportal.web.thirdparty.daps.ext.instantiateResource
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.representations.idm.ClientRepresentation
import org.keycloak.representations.idm.ProtocolMapperRepresentation
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate

class DapsClient(private val dapsConfig: DapsConfig): AutoCloseable {

    private val realmName = dapsConfig.realmName()

    private val keycloak = KeycloakBuilder.builder()
        .serverUrl(dapsConfig.url())
        .realm(realmName)
        .grantType("client_credentials")
        .clientId(dapsConfig.clientId())
        .clientSecret(dapsConfig.clientSecret())
        .build()

    private val customKeycloakResource by lazy { keycloak.instantiateResource<CustomKeycloakResource>() }

    override fun close() {
        keycloak.close()
    }

    fun createClient(clientId: String) {
        keycloak.realm(realmName).clients().create(buildClientRepresentation(clientId))
    }

    fun deleteClient(clientId: String) {
        val client = getClientById(clientId)
        keycloak.realm(realmName).clients().get(client.id).remove()
    }

    fun addCertificate(clientId: String, certificate: String) {
        val client = getClientById(clientId)

        customKeycloakResource.uploadJksCertificate(
            realmName,
            client.id,
            "jwt.credential",
            certificate.toByteArray(StandardCharsets.UTF_8),
            "Certificate PEM"
        )
    }

    fun configureMappers(clientId: String, connectorId: String, certificate: String) {
        val client = getClientById(clientId)

        keycloak.realm(realmName).clients().get(client.id).protocolMappers.mappers.forEach {
            it.config["access.token.claim"] = "false"
            keycloak.realm(realmName).clients().get(client.id).protocolMappers.update(it.id, it)
        }

        val certSha256 = generateSha256(certificate)
        val datMapper = ProtocolMapperRepresentation().apply {
            protocol = "openid-connect"
            protocolMapper = "dat-mapper"
            name = "DAT Mapper"
            config = mapOf(
                "security-profile-claim" to "idsc:BASE_SECURITY_PROFILE",
                "audience-claim" to "idsc:IDS_CONNECTORS_ALL",
                "scope-claim" to "idsc:IDS_CONNECTOR_ATTRIBUTES_ALL",
                "subject-claim" to clientId,
                "referring-connector-claim" to connectorId,
                "transport-certs-claim" to certSha256,
                "access.token.claim" to "true"
            )
        }
        keycloak.realm(realmName).clients().get(client.id).protocolMappers.createMapper(datMapper)
    }

    private fun getClientById(clientId: String): ClientRepresentation =
        keycloak.realm(realmName).clients().findByClientId(clientId).firstOrNull() ?: error("Client not found")

    private fun buildClientRepresentation(clientId: String): ClientRepresentation {
        return ClientRepresentation().apply {
            this.clientId = clientId
            isStandardFlowEnabled = false
            isDirectAccessGrantsEnabled = false
            isServiceAccountsEnabled = true
            clientAuthenticatorType = "client-jwt"
        }
    }

    private fun generateSha256(certString: String): String {
        // DER
        val certInputStream = certString.byteInputStream()
        val certFactory = CertificateFactory.getInstance("X.509")
        val certificate = certFactory.generateCertificate(certInputStream) as X509Certificate
        val der = certificate.encoded

        // SHA256
        val sha256 = MessageDigest.getInstance("SHA-256")
        val hash = sha256.digest(der)
        return hash.joinToString("") { String.format("%02x", it) }
    }
}
