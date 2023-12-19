package de.sovity.authorityportal.web.utils.idmanagement

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class ClientIdUtilsTest {

    @InjectMocks
    lateinit var clientIdUtils: ClientIdUtils

    @Test
    fun testGenerateClientId() {
        // arrange
        val certString = "-----BEGIN CERTIFICATE-----\r\nMIID0zCCArugAwIBAgIHAXAoiDMABDANBgkqhkiG9w0BAQUFADCBqTEmMCQGA1UE\r\nAxMdaHR0cHM6Ly94YW1wbGUudGVzdC9jb25uZWN0b3IxCzAJBgNVBAYTAkRFMQww\r\nCgYDVQQIEwNOUlcxDzANBgNVBAcTBkJvY2h1bTEYMBYGA1UEChMPTXkgT3JnYW5p\r\nemF0aW9uMR0wGwYDVQQLExRTb2Z0d2FyZSBEZXZlbG9wbWVudDEaMBgGCSqGSIb3\r\nDQEJARMLYXNkQGFzZC5hc2QwHhcNMjMxMjE4MDgzMjEwWhcNMjgxMjE4MDgzMjEw\r\nWjCBqTEmMCQGA1UEAxMdaHR0cHM6Ly94YW1wbGUudGVzdC9jb25uZWN0b3IxCzAJ\r\nBgNVBAYTAkRFMQwwCgYDVQQIEwNOUlcxDzANBgNVBAcTBkJvY2h1bTEYMBYGA1UE\r\nChMPTXkgT3JnYW5pemF0aW9uMR0wGwYDVQQLExRTb2Z0d2FyZSBEZXZlbG9wbWVu\r\ndDEaMBgGCSqGSIb3DQEJARMLYXNkQGFzZC5hc2QwggEiMA0GCSqGSIb3DQEBAQUA\r\nA4IBDwAwggEKAoIBAQCwSSheLeuwFvLGff//TY91mEJci4XeUBsmKhWwmwdB0Fw9\r\nREe2mTB14rhSYaXo117PnpzidKwczAbF8jl3jAhlca9vDhQm8RmFsD1BguLLoGEg\r\n9ODQvoiZS3JigdwSSQNKh9PzB5Xy+ymiH35phh/YshyaNqCSzwgnhFxui8pBs3zi\r\ngdsOuBOrGOV/wdmNrWngWNIE0gKltq4E2v1hSNLqpQAZOJVh39Fsxhoz8c8HlC5R\r\nftJQg/0EWnskVlD5fJB3swn0L5B0EIqu0eKtwdah48XtKnQ4kyx1YBWkPIB2O7Tf\r\nFgyEiWuwPky4ZNGbaz+N6l2EEp3yJQRXdSecTlwhAgMBAAEwDQYJKoZIhvcNAQEF\r\nBQADggEBAKo+aNnxvXaOWtKjfRgFUJrBXjWC2EYwaptVQFulGs5kHcWHEAWa66yt\r\n3pGhiKsC2mVGfQy46EGTExw8CNFlup7H04NrpfJpQHWVX5YoFA9wxFycszZmuN8n\r\np8CqjhDfflMVsw7RuO73YLZz4f2ZZLDyOlGTdqW7KsQ933Xt3mIGX+HI8X153b6H\r\nxTFuDMedtWjeroOUe3j9m2RRQg94fCpBuNMDa6/WSBeJabDbhhao6xF908n5smRy\r\nBOQILU2dhm1uQllQ4vpla65WA8mVGDAyLzqllSJmloq/WXerS35ZYBrfq8WCr99o\r\nE4JoOx5lnp0mx9XakpDPt8wBLM8Qn5M=\r\n-----END CERTIFICATE-----\r\n"

        // act
        val result = clientIdUtils.generateClientId(certString)

        // assert
        assertThat(result).isEqualTo("84:94:E5:E8:52:A7:B9:79:E3:B5:0F:E3:D9:7F:A2:D7:E8:71:15:0F:keyid:84:94:E5:E8:52:A7:B9:79:E3:B5:0F:E3:D9:7F:A2:D7:E8:71:15:0F")
    }
}
