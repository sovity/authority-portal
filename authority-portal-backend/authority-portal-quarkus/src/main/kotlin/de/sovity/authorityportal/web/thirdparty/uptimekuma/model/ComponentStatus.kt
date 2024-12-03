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

import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.ComponentStatus.entries


enum class ComponentStatus(val intValue: Int) {
    UP(1),
    DOWN(0),
    PENDING(2),
    MAINTENANCE(3);

    companion object {
        private val map = entries.associateBy(ComponentStatus::intValue)
        fun fromInt(value: Int): ComponentStatus? = map[value]
    }
}
