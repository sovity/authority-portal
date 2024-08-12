/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

package de.sovity.authorityportal.web.thirdparty.uptimekuma

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.ComponentStatus
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.ComponentStatusOverview
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.util.Base64
import kotlin.jvm.optionals.getOrNull

@ApplicationScoped
class UptimeKumaClient(
    val deploymentEnvironmentService: DeploymentEnvironmentService,
    val uptimeKumaClientResource: UptimeKumaClientResource,
    @ConfigProperty(name = "authority-portal.kuma.api-key") val uptimeKumaApiKey: String,
) {

    fun getStatusByEnvironments(): Map<String, ComponentStatusOverview> {
        val basicAuthHeader = Base64.getEncoder().encodeToString(":$uptimeKumaApiKey".toByteArray())
        val response = uptimeKumaClientResource.getMetrics("Basic $basicAuthHeader")

        val environments = deploymentEnvironmentService.findAll()
        return environments.mapValues { getComponentStatusOverview(response, it.value) }
    }

    private fun getComponentStatusOverview(
        response: String,
        envConfig: DeploymentEnvironment
    ): ComponentStatusOverview =
        ComponentStatusOverview().also {
            it.daps = getComponentStatus(envConfig.daps().kumaName(), response)
            it.catalogCrawler = getComponentStatus(envConfig.dataCatalog().kumaName(), response)
            it.loggingHouse = getComponentStatus(
                envConfig.loggingHouse().get().kumaName(),
                response
            ).takeUnless { envConfig.loggingHouse().getOrNull()?.kumaName().isNullOrBlank() }
        }

    private fun getComponentStatus(componentName: String, response: String): ComponentStatus {
        val regex = Regex("""monitor_status\{[^}]*monitor_name="$componentName"[^}]*\} (\d+)""")
        val matchResult = regex.find(response)
        val statusNumber = matchResult?.groupValues?.get(1)?.toIntOrNull()
            ?: run {
                Log.error("Invalid response from Uptime Kuma. Cannot parse statuses.")
                return ComponentStatus.DOWN
            }

        return ComponentStatus.fromInt(statusNumber)
            ?: run {
                Log.error("Invalid response from Uptime Kuma. Status number $statusNumber is not known.")
                return ComponentStatus.DOWN
            }
    }
}
