package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Status of a CaaS connector", enumAsRef = true)
public enum ConnectorStatusDto {
    // CaaS
    INIT,
    PROVISIONING,
    AWAITING_RUNNING,
    RUNNING,
    DEPROVISIONING,
    AWAITING_STOPPED,
    STOPPED,
    ERROR,
    NOT_FOUND,
    // Self-hosted EDC connectors
    ONLINE,
    OFFLINE,
    DEAD,
    // Fallback
    UNKNOWN
}
