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

package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.ConnectorService.UnregisteredBrokerConnector
import de.sovity.authorityportal.web.thirdparty.broker.model.AddedConnector
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional

@ApplicationScoped
class BrokerSyncService {

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    @Transactional
    @Scheduled(every = "15m")
    fun repeatFailedRegistrations() {
        // Connectors
        val failedRegistrations = connectorService.getUnregisteredBrokerConnectors().groupBy { it.environmentId }
        failedRegistrations.forEach {
            registerConnectors(it.key, it.value)
        }
    }

    private fun registerConnectors(envId: String, connectors: List<UnregisteredBrokerConnector>) {
        try {
            val addedConnectors = connectors.map { cr ->
                AddedConnector().also {
                    it.connectorEndpoint = cr.connectorEndpointUrl
                    it.mdsId = cr.mdsId
                }
            }
            val connectorIds = connectors.map { it.connectorId }
            brokerClientService.forEnvironment(envId).addConnectors(addedConnectors)
            connectorService.setConnectorBrokerRegistrationStatus(connectorIds, ConnectorBrokerRegistrationStatus.REGISTERED)
        } catch (e: Exception) {
            Log.error("Failed to re-register connectors in broker. envId=$envId", e)
        }
    }
}
