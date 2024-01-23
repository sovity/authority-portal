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
        val certString = "-----BEGIN CERTIFICATE-----\r\nMIID0zCCArugAwIBAgIHAXAoiDMABDANBgkqhkiG9w0BAQUFADCBqTEmMCQGA1UE\r\nAxMdaHR0cHM6Ly94YW1wbGUudGVzdC9jb25uZWN0b3IxCzAJBgNVBAYTAkRFMQww\r\nCgYDVQQIEwNOUlcxDzANBgNVBAcTBkJvY2h1bTEYMBYGA1UEChMPTXkgT3JnYW5p\r\nemF0aW9uMR0wGwYDVQQLExRTb2Z0d2FyZSBEZXZlbG9wbWVudDEaMBgGCSqGSIb3\r\nDQEJARMLYXNkQGFzZC5hc2QwHhcNMjMxMjE4MDgzMjEwWhcNMjgxMjE4MDgzMjEw\r\nWjCBqTEmMCQGA1UEAxMdaHR0cHM6Ly94YW1wbGUudGVzdC9jb25uZWN0b3IxCzAJ\r\nBgNVBAYTAkRFMQwwCgYDVQQIEwNOUlcxDzANBgNVBAcTBkJvY2h1bTEYMBYGA1UE\r\nChMPTXkgT3JnYW5pemF0aW9uMR0wGwYDVQQLExRTb2Z0d2FyZSBEZXZlbG9wbWVu\r\ndDEaMBgGCSqGSIb3DQEJARMLYXNkQGFzZC5hc2QwggEiMA0GCSqGSIb3DQEBAQUA\r\nA4IBDwAwggEKAoIBAQCwSSheLeuwFvLGff//TY91mEJci4XeUBsmKhWwmwdB0Fw9\r\nREe2mTB14rhSYaXo117PnpzidKwczAbF8jl3jAhlca9vDhQm8RmFsD1BguLLoGEg\r\n9ODQvoiZS3JigdwSSQNKh9PzB5Xy+ymiH35phh/YshyaNqCSzwgnhFxui8pBs3zi\r\ngdsOuBOrGOV/wdmNrWngWNIE0gKltq4E2v1hSNLqpQAZOJVh39Fsxhoz8c8HlC5R\r\nftJQg/0EWnskVlD5fJB3swn0L5B0EIqu0eKtwdah48XtKnQ4kyx1YBWkPIB2O7Tf\r\nFgyEiWuwPky4ZNGbaz+N6l2EEp3yJQRXdSecTlwhAgMBAAEwDQYJKoZIhvcNAQEF\r\nBQADggEBAKo+aNnxvXaOWtKjfRgFUJrBXjWC2EYwaptVQFulGs5kHcWHEAWa66yt\r\n3pGhiKsC2mVGfQy46EGTExw8CNFlup7H04NrpfJpQHWVX5YoFA9wxFycszZmuN8n\r\np8CqjhDfflMVsw7RuO73YLZz4f2ZZLDyOlGTdqW7KsQ933Xt3mIGX+HI8X153b6H\r\nxTFuDMedtWjeroOUe3j9m2RRQg94fCpBuNMDa6/WSBeJabDbhhao6xF908n5smRy\r\nBOQILU2dhm1uQllQ4vpla65WA8mVGDAyLzqllSJmloq/WXerS35ZYBrfq8WCr99o\r\nE4JoOx5lnp0mx9XakpDPt8wBLM8Qn5M=\r\n-----END CERTIFICATE-----\r\n"

        // act
        val result = clientIdUtils.generateClientId(certString)

        // assert
        assertThat(result).isEqualTo("84:94:E5:E8:52:A7:B9:79:E3:B5:0F:E3:D9:7F:A2:D7:E8:71:15:0F:keyid:84:94:E5:E8:52:A7:B9:79:E3:B5:0F:E3:D9:7F:A2:D7:E8:71:15:0F")
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
