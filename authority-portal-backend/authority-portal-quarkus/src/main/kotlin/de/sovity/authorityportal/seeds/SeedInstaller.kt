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

package de.sovity.authorityportal.seeds

import io.quarkus.runtime.Startup
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.util.Optional

@ApplicationScoped
class SeedInstaller(
    val scenarios: Instance<SeedScenario>,
    @ConfigProperty(name = "authority-portal.seed.scenario") val scenarioId: Optional<String>
) {

    @Startup
    @Transactional
    fun seed() {
        if (scenarioId.isEmpty || scenarioId.get() == "none") {
            return
        }

        val scenario = scenarios.find { it.name == scenarioId.get() }
        scenario?.install() ?: error("Unknown seed scenario: ${scenarioId.get()}")
    }
}
