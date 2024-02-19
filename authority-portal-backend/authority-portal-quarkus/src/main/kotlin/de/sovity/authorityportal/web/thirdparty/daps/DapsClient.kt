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
        if (client != null) {
            keycloak.realm(realmName).clients().get(client.id).remove()
        }
    }

    fun addCertificate(clientId: String, certificate: String) {
        val client = getClientById(clientId) ?: error("Client not found")

        customKeycloakResource.uploadJksCertificate(
            realmName,
            client.id,
            "jwt.credential",
            certificate.toByteArray(StandardCharsets.UTF_8),
            "Certificate PEM"
        )
    }

    fun addJwksUrl(clientId: String, jwksUrl: String) {
        val client = getClientById(clientId) ?: error("Client not found")

        client.attributes["jwks.url"] = jwksUrl
        client.attributes["use.jwks.url"] = "true"
        keycloak.realm(realmName).clients().get(client.id).update(client)
    }

    fun configureMappers(clientId: String, connectorId: String, certificate: String) {
        val client = getClientById(clientId) ?: error("Client not found")
        setAccessTokenClaim(client)

        val datMapper = buildDatMapper(clientId, connectorId)
        datMapper.config["transport-certs-claim"] = generateSha256(certificate)

        keycloak.realm(realmName).clients().get(client.id).protocolMappers.createMapper(datMapper)
    }

    fun configureMappers(clientId: String, connectorId: String) {
        val client = getClientById(clientId) ?: error("Client not found")
        setAccessTokenClaim(client)

        val datMapper = buildDatMapper(clientId, connectorId)
        keycloak.realm(realmName).clients().get(client.id).protocolMappers.createMapper(datMapper)
    }

    private fun setAccessTokenClaim(client: ClientRepresentation) {
        keycloak.realm(realmName).clients().get(client.id).protocolMappers.mappers.forEach {
            it.config["access.token.claim"] = "false"
            keycloak.realm(realmName).clients().get(client.id).protocolMappers.update(it.id, it)
        }
    }

    private fun buildDatMapper(clientId: String, connectorId: String): ProtocolMapperRepresentation {
        val datMapper = ProtocolMapperRepresentation().apply {
            protocol = "openid-connect"
            protocolMapper = "dat-mapper"
            name = "DAT Mapper"
            config = buildMap<String, String>() {
                put("security-profile-claim", "idsc:BASE_SECURITY_PROFILE")
                put("audience-claim", "idsc:IDS_CONNECTORS_ALL")
                put("scope-claim", "idsc:IDS_CONNECTOR_ATTRIBUTES_ALL")
                put("subject-claim", clientId)
                put("referring-connector-claim", connectorId)
                put("access.token.claim", "true")
            }
        }
        return datMapper
    }

    private fun getClientById(clientId: String): ClientRepresentation? =
        keycloak.realm(realmName).clients().findByClientId(clientId).firstOrNull()

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
