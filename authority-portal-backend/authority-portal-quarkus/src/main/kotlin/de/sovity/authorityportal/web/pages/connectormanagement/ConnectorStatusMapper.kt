package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.organization.ConnectorStatusDto
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasStatusDto

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

fun CaasStatus.toDto(): ConnectorStatusDto = when (this) {
    CaasStatus.INIT -> ConnectorStatusDto.INIT
    CaasStatus.PROVISIONING -> ConnectorStatusDto.PROVISIONING
    CaasStatus.AWAITING_RUNNING -> ConnectorStatusDto.AWAITING_RUNNING
    CaasStatus.RUNNING -> ConnectorStatusDto.RUNNING
    CaasStatus.DEPROVISIONING -> ConnectorStatusDto.DEPROVISIONING
    CaasStatus.AWAITING_STOPPED -> ConnectorStatusDto.AWAITING_STOPPED
    CaasStatus.STOPPED -> ConnectorStatusDto.STOPPED
    CaasStatus.ERROR -> ConnectorStatusDto.ERROR
    CaasStatus.NOT_FOUND -> ConnectorStatusDto.NOT_FOUND
}

fun ConnectorOnlineStatus.toDto(): ConnectorStatusDto = when (this) {
    ConnectorOnlineStatus.ONLINE -> ConnectorStatusDto.ONLINE
    ConnectorOnlineStatus.OFFLINE -> ConnectorStatusDto.OFFLINE
    ConnectorOnlineStatus.DEAD -> ConnectorStatusDto.DEAD
}
