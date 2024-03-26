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

package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.ConfigResource
import io.quarkus.logging.Log
import jakarta.annotation.security.PermitAll
import jakarta.transaction.Transactional
import org.jboss.logmanager.LogManager
import java.util.logging.Level

@PermitAll // auth checks will be in ConfigApiKeyFilter for this unit
class ConfigResourceImpl : ConfigResource {

    @Transactional
    override fun setLogLevel(level: String): String {
        LogManager.getLogManager().getLogger("").level = Level.parse(level)
        Log.info("Log level set to $level.")
        return "Log level set to $level"
    }
}
