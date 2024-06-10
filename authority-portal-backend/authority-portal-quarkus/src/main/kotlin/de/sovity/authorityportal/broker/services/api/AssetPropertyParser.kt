/*
 *  Copyright (c) 2023 sovity GmbH
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       sovity GmbH - initial API and implementation
 *
 */
package de.sovity.authorityportal.broker.services.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import lombok.SneakyThrows

@ApplicationScoped
class AssetPropertyParser(
    val objectMapper: ObjectMapper
) {

    private val typeToken: TypeReference<Map<String, String>> = object : TypeReference<Map<String, String>>() {}

    @SneakyThrows
    fun parsePropertiesFromJsonString(assetPropertiesJson: String): Map<String, String> {
        return objectMapper.readValue(assetPropertiesJson, typeToken)
    }
}
