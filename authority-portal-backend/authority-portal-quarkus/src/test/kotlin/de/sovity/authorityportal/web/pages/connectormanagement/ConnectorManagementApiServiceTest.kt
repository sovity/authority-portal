package de.sovity.authorityportal.web.pages.connectormanagement

import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

@QuarkusTest
class ConnectorManagementApiServiceTest {

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService


    @Test
    fun testGetAllDeploymentEnvironment() {
        // act
        val result = connectorManagementApiService.getAllDeploymentEnvironment()

        // assert
        assertEquals(1, result.size)
        assertEquals("test", result.get(0).environmentId)
        assertEquals("Test Environment", result.get(0).title)
    }
}
