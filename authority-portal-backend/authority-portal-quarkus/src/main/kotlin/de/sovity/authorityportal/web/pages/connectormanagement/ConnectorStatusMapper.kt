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

package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorStatusDto
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorUptimeStatus
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasStatusDto

// Mapping from external API to our DB
fun CaasStatusDto.toDb(): CaasStatus = when (this) {
    CaasStatusDto.INIT -> CaasStatus.INIT
    CaasStatusDto.PROVISIONING -> CaasStatus.PROVISIONING
    CaasStatusDto.AWAITING_RUNNING -> CaasStatus.AWAITING_RUNNING
    CaasStatusDto.RUNNING -> CaasStatus.RUNNING
    CaasStatusDto.DEPROVISIONING -> CaasStatus.DEPROVISIONING
    CaasStatusDto.AWAITING_STOPPED -> CaasStatus.AWAITING_STOPPED
    CaasStatusDto.STOPPED -> CaasStatus.STOPPED
    CaasStatusDto.ERROR -> CaasStatus.ERROR
    CaasStatusDto.NOT_FOUND -> CaasStatus.NOT_FOUND
}

// Mapping from our DB to the UI
fun CaasStatus.toDto(): ConnectorStatusDto = when (this) {
    CaasStatus.INIT -> ConnectorStatusDto.INIT
    CaasStatus.PROVISIONING -> ConnectorStatusDto.PROVISIONING
    CaasStatus.AWAITING_RUNNING -> ConnectorStatusDto.AWAITING_RUNNING
    CaasStatus.RUNNING -> ConnectorStatusDto.ONLINE // streamlined wording for consistency with regular connectors
    CaasStatus.DEPROVISIONING -> ConnectorStatusDto.DEPROVISIONING
    CaasStatus.AWAITING_STOPPED -> ConnectorStatusDto.AWAITING_STOPPED
    CaasStatus.STOPPED -> ConnectorStatusDto.OFFLINE // streamlined wording for consistency with regular connectors
    CaasStatus.ERROR -> ConnectorStatusDto.ERROR
    CaasStatus.NOT_FOUND -> ConnectorStatusDto.NOT_FOUND
}

// Mapping from our DB to the UI
fun ConnectorOnlineStatus.toDto(): ConnectorStatusDto = when (this) {
    ConnectorOnlineStatus.ONLINE -> ConnectorStatusDto.ONLINE
    ConnectorOnlineStatus.OFFLINE -> ConnectorStatusDto.OFFLINE
    ConnectorOnlineStatus.DEAD -> ConnectorStatusDto.OFFLINE // changed
}

// Mapping from Connector Table to Uptime monitoring table
fun ConnectorOnlineStatus.toDb(): ConnectorUptimeStatus = when (this) {
    ConnectorOnlineStatus.ONLINE -> ConnectorUptimeStatus.UP
    ConnectorOnlineStatus.OFFLINE -> ConnectorUptimeStatus.DOWN
    ConnectorOnlineStatus.DEAD -> ConnectorUptimeStatus.DEAD
}
