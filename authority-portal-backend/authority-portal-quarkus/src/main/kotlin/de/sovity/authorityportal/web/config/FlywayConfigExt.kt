package de.sovity.authorityportal.web.config

import io.quarkus.flyway.FlywayConfigurationCustomizer
import jakarta.inject.Singleton
import org.flywaydb.core.api.configuration.FluentConfiguration

@Singleton
class FlywayConfigExt : FlywayConfigurationCustomizer {
    override fun customize(configuration: FluentConfiguration) {
        // We need to mix transactional and non-transactional transactions in migrations,
        // because we want to change enum values in migrations
        configuration.mixed(true)
    }
}
