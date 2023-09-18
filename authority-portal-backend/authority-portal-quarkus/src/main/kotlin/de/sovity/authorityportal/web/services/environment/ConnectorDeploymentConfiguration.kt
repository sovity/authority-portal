package de.sovity.authorityportal.web.services.environment

import io.smallrye.config.ConfigMapping

@ConfigMapping(prefix = "authority-portal.deployment")
interface ConnectorDeploymentConfiguration {
    fun environments(): Map<String, ConnectorDeploymentEnvironment>

    interface ConnectorDeploymentEnvironment {
        fun title(): String
        fun daps(): DapsConfig
        fun broker(): BrokerConfig

        interface DapsConfig {
            fun url(): String
            fun realmName(): String
            fun clientId(): String
            fun clientSecret(): String
        }

        interface BrokerConfig {
            fun url(): String
            fun adminApiKey(): String
            fun apiKey(): String
        }
    }
}
