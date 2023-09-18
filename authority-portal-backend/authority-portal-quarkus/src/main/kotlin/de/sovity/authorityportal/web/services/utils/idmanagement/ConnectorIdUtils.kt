package de.sovity.authorityportal.web.services.utils.idmanagement

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.web.services.utils.idmanagement.MdsIdUtils.Companion.MDS_ID_LENGTH
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class ConnectorIdUtils {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var idUtils: IdUtils

    private val mdsIdCompleteLength = 4 + MDS_ID_LENGTH + 2

    private val connectorIdLength = 4

    fun generateConnectorId(mdsId: String): String {
        val usedConnectorIds = getUsedConnectorIds(mdsId)
        var connectorId: String

        do {
            connectorId = getConnectorIdCandidate(mdsId)
        } while (usedConnectorIds.contains(connectorId))

        return connectorId
    }

    fun assertValidConnectorId(connectorId: String) {
        if (!validateConnectorId(connectorId)) {
            error("Invalid Connector-ID: $connectorId")
        }
    }

    private fun validateConnectorId(connectorId: String): Boolean {
        val checksum = connectorId.takeLast(2)
        val id = connectorId.drop(mdsIdCompleteLength + 2).dropLast(2)

        return idUtils.calculateVerificationDigits(id) == checksum
    }

    private fun getConnectorIdCandidate(mdsId: String): String {
        val prefix = "$mdsId.C"
        val identifier = idUtils.randomIdentifier(connectorIdLength)
        val checksum = idUtils.calculateVerificationDigits(identifier)
        return "$prefix$identifier$checksum"
    }

    private fun getUsedConnectorIds(mdsId: String): Set<String> {
        val c = Tables.CONNECTOR
        return dsl.select(c.CONNECTOR_ID)
            .from(c)
            .where(c.MDS_ID.eq(mdsId))
            .fetchSet(c.CONNECTOR_ID)
    }
}
