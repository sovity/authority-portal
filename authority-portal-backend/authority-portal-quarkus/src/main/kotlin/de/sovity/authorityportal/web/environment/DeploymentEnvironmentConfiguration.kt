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
