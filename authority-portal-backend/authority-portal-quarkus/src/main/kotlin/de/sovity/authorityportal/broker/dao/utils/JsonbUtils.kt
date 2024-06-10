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
package de.sovity.authorityportal.broker.dao.utils

import org.jooq.JSONB

/**
 * Utilities for dealing with [JSONB] fields.
 */
object JsonbUtils {
    /**
     * Returns the data of the given [JSONB] or null.
     *
     * @param jsonb [org.jooq.JSON]
     * @return data or null
     */
    fun getDataOrNull(jsonb: JSONB): String {
        return jsonb.data()
    }
}
