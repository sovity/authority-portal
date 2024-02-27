package de.sovity.authorityportal.web.thirdparty.uptimekuma

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.ComponentStatus
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.ComponentStatusOverview
import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.annotation.PostConstruct
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.net.URI
import java.util.Base64

@ApplicationScoped
class UptimeKumaClient {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var uptimeKumaClientResource: UptimeKumaClientResource

    @ConfigProperty(name = "authority-portal.kuma.api-key")
    lateinit var uptimeKumaApiKey: String


    fun getStatusByEnvironments(): Map<String, ComponentStatusOverview> {
        val basicAuthHeader = Base64.getEncoder().encodeToString(":$uptimeKumaApiKey".toByteArray())
        val response = uptimeKumaClientResource.getMetrics("Basic $basicAuthHeader")

        val environments = deploymentEnvironmentService.findAll()
        return environments.mapValues { getComponentStatusOverview(response, it.value) }
    }

    private fun getComponentStatusOverview(response: String, envConfig: DeploymentEnvironment): ComponentStatusOverview =
        ComponentStatusOverview().also {
            it.broker = getComponentStatus(envConfig.broker().kumaName(), response)
            it.daps = getComponentStatus(envConfig.daps().kumaName(), response)
            it.loggingHouse = getComponentStatus(envConfig.loggingHouse().kumaName(), response)
        }

    private fun getComponentStatus(componentName: String, response: String): ComponentStatus {
        val regex = Regex("""monitor_status\{[^}]*monitor_name="$componentName"[^}]*\} (\d+)""")
        val matchResult = regex.find(response)
        val statusNumber = matchResult?.groupValues?.get(1)?.toInt()
            ?: error("Invalid response from Uptime Kuma. Cannot parse statuses.")

        return ComponentStatus.fromInt(statusNumber)
            ?: error("Invalid response from Uptime Kuma. Status number $statusNumber is not known.")
    }
}