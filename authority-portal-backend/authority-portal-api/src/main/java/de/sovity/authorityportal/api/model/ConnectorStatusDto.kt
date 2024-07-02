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

package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Status of a CaaS connector", enumAsRef = true)
enum class ConnectorStatusDto {
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
