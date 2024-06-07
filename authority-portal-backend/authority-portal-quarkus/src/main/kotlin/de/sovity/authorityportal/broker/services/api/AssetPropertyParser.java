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

package de.sovity.authorityportal.broker.services.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

import java.util.Map;

@ApplicationScoped
public class AssetPropertyParser {
    @Inject
    ObjectMapper objectMapper;

    private final TypeReference<Map<String, String>> typeToken = new TypeReference<>() {
    };

    @SneakyThrows
    public Map<String, String> parsePropertiesFromJsonString(String assetPropertiesJson) {
        return objectMapper.readValue(assetPropertiesJson, typeToken);
    }
}
