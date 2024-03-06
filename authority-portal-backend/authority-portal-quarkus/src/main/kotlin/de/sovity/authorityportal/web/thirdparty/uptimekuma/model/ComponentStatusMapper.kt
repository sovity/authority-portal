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

package de.sovity.authorityportal.web.thirdparty.uptimekuma.model

import de.sovity.authorityportal.api.model.ComponentStatusDto
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus

fun ComponentStatus.toDb(): ComponentOnlineStatus = when (this) {
    ComponentStatus.UP -> ComponentOnlineStatus.UP
    ComponentStatus.DOWN -> ComponentOnlineStatus.DOWN
    ComponentStatus.PENDING -> ComponentOnlineStatus.PENDING
    ComponentStatus.MAINTENANCE -> ComponentOnlineStatus.MAINTENANCE
}

fun ComponentOnlineStatus.toDto(): ComponentStatusDto = when (this) {
    ComponentOnlineStatus.UP -> ComponentStatusDto.UP
    ComponentOnlineStatus.DOWN -> ComponentStatusDto.DOWN
    ComponentOnlineStatus.PENDING -> ComponentStatusDto.PENDING
    ComponentOnlineStatus.MAINTENANCE -> ComponentStatusDto.MAINTENANCE
}
