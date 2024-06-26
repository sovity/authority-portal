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

import de.sovity.authorityportal.seeds.utils.ScenarioData
import jakarta.transaction.Transactional

interface SeedScenario {
    val name: String

    @Transactional
    fun install()
    fun init(): ScenarioData
}
