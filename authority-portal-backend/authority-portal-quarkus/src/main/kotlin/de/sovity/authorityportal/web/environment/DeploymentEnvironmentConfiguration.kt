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

@ConfigMapping(prefix = "authority-portal.deployment")
interface DeploymentEnvironmentConfiguration {
    fun environments(): Map<String, DeploymentEnvironment>

    interface DeploymentEnvironment {
        fun title(): String
        fun position(): Int
        fun daps(): DapsConfig
        fun broker(): BrokerConfig
        fun loggingHouse(): LoggingHouseConfig

        interface DapsConfig {
            fun url(): String
            fun realmName(): String
            fun clientId(): String
            fun clientSecret(): String
            fun kumaName(): String
        }

        interface BrokerConfig {
            fun url(): String
            fun adminApiKey(): String
            fun apiKey(): String
            fun kumaName(): String
        }

        interface LoggingHouseConfig {
            fun url(): String
            fun kumaName(): String
        }
    }
}
