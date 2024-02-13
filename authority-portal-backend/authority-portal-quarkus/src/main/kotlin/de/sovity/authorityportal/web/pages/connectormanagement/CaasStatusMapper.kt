package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.web.thirdparty.caas.model.ConnectorStatus

fun ConnectorStatus.toDb(): CaasStatus = when (this) {
    ConnectorStatus.INIT -> CaasStatus.INIT
    ConnectorStatus.PROVISIONING -> CaasStatus.PROVISIONING
    ConnectorStatus.AWAITING_RUNNING -> CaasStatus.AWAITING_RUNNING
    ConnectorStatus.RUNNING -> CaasStatus.RUNNING
    ConnectorStatus.DEPROVISIONING -> CaasStatus.DEPROVISIONING
    ConnectorStatus.AWAITING_STOPPED -> CaasStatus.AWAITING_STOPPED
    ConnectorStatus.STOPPED -> CaasStatus.STOPPED
    ConnectorStatus.ERROR -> CaasStatus.ERROR
    ConnectorStatus.NOT_FOUND -> CaasStatus.NOT_FOUND
}

fun CaasStatus.toDto(): ConnectorStatus = when (this) {
    CaasStatus.INIT -> ConnectorStatus.INIT
    CaasStatus.PROVISIONING -> ConnectorStatus.PROVISIONING
    CaasStatus.AWAITING_RUNNING -> ConnectorStatus.AWAITING_RUNNING
    CaasStatus.RUNNING -> ConnectorStatus.RUNNING
    CaasStatus.DEPROVISIONING -> ConnectorStatus.DEPROVISIONING
    CaasStatus.AWAITING_STOPPED -> ConnectorStatus.AWAITING_STOPPED
    CaasStatus.STOPPED -> ConnectorStatus.STOPPED
    CaasStatus.ERROR -> ConnectorStatus.ERROR
    CaasStatus.NOT_FOUND -> ConnectorStatus.NOT_FOUND
}
