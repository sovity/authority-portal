package de.sovity.authorityportal.web.utils.idmanagement

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class ClientIdUtilsTest {

    @Inject
    lateinit var clientIdUtils: ClientIdUtils

    @Inject
    lateinit var dsl: DSLContext

    @Test
    fun testGenerateClientId() {
        // arrange
        val certString = "-----BEGIN CERTIFICATE-----\r\n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\r\n-----END CERTIFICATE-----"

        // act
        val result = clientIdUtils.generateClientId(certString)

        // assert
        assertThat(result).isEqualTo("F3:64:FD:0B:CD:B9:E1:E3:3F:29:C2:32:7F:15:AE:E3:8F:76:88:58:keyid:93:37:7D:FE:04:F3:A8:82:47:89:09:E9:1D:B3:3A:E1:92:1D:B1:4C")
    }

    @Test
    fun doesClientIdExistTest() {
        // arrange
        setupDb()

        // act
        val result1 = clientIdUtils.exists("connectorClientId")
        val result2 = clientIdUtils.exists("componentClientId")

        // assert
        assertThat(result1).isTrue()
        assertThat(result2).isTrue()
    }

    private fun setupDb() {
        dsl.insertInto(Tables.CONNECTOR)
            .set(Tables.CONNECTOR.CONNECTOR_ID, "connectorId")
            .set(Tables.CONNECTOR.MDS_ID, "MDSL1111AA")
            .set(Tables.CONNECTOR.ENVIRONMENT, "envId")
            .set(Tables.CONNECTOR.CLIENT_ID, "connectorClientId")
            .set(Tables.CONNECTOR.CREATED_BY, "00000000-0000-0000-0000-00000001")
            .set(Tables.CONNECTOR.NAME, "connectorName")
            .set(Tables.CONNECTOR.URL, "connectorUrl")
            .set(Tables.CONNECTOR.LOCATION, "connectorLocation")
            .set(Tables.CONNECTOR.PROVIDER_MDS_ID, "MDSL2222BB")
            .set(Tables.CONNECTOR.TYPE, ConnectorType.OWN)
            .set(Tables.CONNECTOR.CREATED_AT, OffsetDateTime.now())
            .execute()

        dsl.insertInto(Tables.COMPONENT)
            .set(Tables.COMPONENT.ID, "componentId")
            .set(Tables.COMPONENT.MDS_ID, "MDSL1111AA")
            .set(Tables.COMPONENT.ENVIRONMENT, "envId")
            .set(Tables.COMPONENT.CLIENT_ID, "componentClientId")
            .set(Tables.COMPONENT.CREATED_BY, "00000000-0000-0000-0000-00000001")
            .set(Tables.COMPONENT.NAME, "componentName")
            .set(Tables.COMPONENT.HOMEPAGE_URL, "componentUrl")
            .set(Tables.COMPONENT.ENDPOINT_URL, "componentEndpointUrl")
            .set(Tables.COMPONENT.CREATED_AT, OffsetDateTime.now())
            .execute()
    }
}
