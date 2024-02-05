package de.sovity.authorityportal.web.pages.connectormanagement

import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

@QuarkusTest
class ConnectorCsvApiServiceTest {

    @Inject
    lateinit var connectorCsvApiService: ConnectorCsvApiService

    @Test
    fun generateConnectorCsv() {
        // arrange
        val expectedCsvContent = "\"Name\",\"Type\",\"MDS ID\",\"Environment\",\"Frontend URL\",\"Endpoint URL\",\"Management API URL\"\n" +
            "\"Example Connector\",\"OWN\",\"MDSL2222CC\",\"test\",\"https://xample.test4/connector\",\"https://xample.test4/connector/api/dsp\",\"https://xample.test4/connector/api/management\"\n"

        // act
        val inputStream = connectorCsvApiService.generateConnectorCsv("MDSL2222CC", "test");
        val content = inputStream.bufferedReader().use { it.readText() }

        // assert
        assertThat(inputStream).isNotNull();
        assertThat(content).isEqualTo(expectedCsvContent)
    }
}
