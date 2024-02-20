package de.sovity.authorityportal.web.pages.connectormanagement

import com.opencsv.CSVWriter
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

@ApplicationScoped
class ConnectorCsvApiService {

    @Inject
    lateinit var connectorService: ConnectorService
    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    fun generateConnectorCsv(mdsId: String, environmentId: String): ByteArrayInputStream {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val connectors = connectorService.getConnectorsByMdsIdAndEnvironment(mdsId, environmentId)

        val csvHeaders = arrayOf("Name", "Type", "MDS ID", "Environment", "Frontend URL", "Endpoint URL", "Management API URL")
        val csvData = mutableListOf(csvHeaders)

        connectors.forEach {
            csvData.add(arrayOf(it.name, it.type.toString(), it.mdsId, it.environment, it.frontendUrl, it.endpointUrl, it.managementUrl))
        }

        val outputStream = ByteArrayOutputStream()
        CSVWriter(outputStream.writer()).use { csvWriter ->
            csvWriter.writeAll(csvData)
        }
        return ByteArrayInputStream(outputStream.toByteArray())
    }
}
