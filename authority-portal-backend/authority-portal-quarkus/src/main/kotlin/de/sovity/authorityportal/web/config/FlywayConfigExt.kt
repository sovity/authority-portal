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
