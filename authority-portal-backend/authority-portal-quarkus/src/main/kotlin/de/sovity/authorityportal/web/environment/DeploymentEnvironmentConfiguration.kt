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

package de.sovity.authorityportal.web.environment

import io.smallrye.config.ConfigMapping
import java.time.Duration
import java.util.Optional

@ConfigMapping(prefix = "authority-portal.deployment")
interface DeploymentEnvironmentConfiguration {
    fun environments(): Map<String, DeploymentEnvironment>

    interface DeploymentEnvironment {
        fun title(): String
        fun position(): Int
        fun daps(): DapsConfig
        fun dataCatalog(): DataCatalogConfig
        fun loggingHouse(): Optional<LoggingHouseConfig>

        interface DapsConfig {
            fun url(): String
            fun realmName(): String
            fun clientId(): String
            fun clientSecret(): String
            fun kumaName(): String
        }

        interface DataCatalogConfig {
            fun hideOfflineDataOffersAfter(): Duration
            fun catalogPagePageSize(): Int
            fun dataspaceNames(): DataspaceNames
            fun kumaName(): String

            interface DataspaceNames {
                fun connectorIds(): Map<String, String>
                fun default(): String
            }
        }

        interface LoggingHouseConfig {
            fun url(): String
            fun kumaName(): String
        }
    }
}
