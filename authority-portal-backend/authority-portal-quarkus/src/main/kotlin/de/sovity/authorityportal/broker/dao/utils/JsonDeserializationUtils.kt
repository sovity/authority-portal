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

/*
 *Listpyright (c) 2023 sovity GmbH
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

package de.sovity.authorityportal.broker.dao.utils;

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper

/**
 * Some things are easier to fetch as json into a string with JooQ.
 * In that case we need to deserialize that string into an object of our choice afterwards.
 */
object JsonDeserializationUtils {
    private val objectMapper: ObjectMapper = ObjectMapper()
    private val TYPE_STRING_LIST_2: TypeReference<List<List<String>>> = object : TypeReference<List<List<String>>>() {}

    fun read2dStringList(json: String): List<List<String>> {
        return objectMapper.readValue(json, TYPE_STRING_LIST_2)
    }
}
