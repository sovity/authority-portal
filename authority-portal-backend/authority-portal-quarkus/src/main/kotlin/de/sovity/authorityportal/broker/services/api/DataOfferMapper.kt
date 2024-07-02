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

package de.sovity.authorityportal.broker.services.api

import com.fasterxml.jackson.databind.ObjectMapper
import de.sovity.edc.ext.wrapper.api.common.model.UiAsset
import de.sovity.edc.ext.wrapper.api.common.model.UiPolicy
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class DataOfferMapper(
    val objectMapper: ObjectMapper
) {
    fun readUiAsset(json: String): UiAsset = objectMapper.readValue(json, UiAsset::class.java)
    fun readUiPolicy(json: String): UiPolicy = objectMapper.readValue(json, UiPolicy::class.java)
}
