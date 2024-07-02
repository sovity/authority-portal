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
package de.sovity.authorityportal.web.utils

/**
 * Splits a string into its words and returns them in lowercase.
 *
 * @return list of lowercase words
 */
fun String?.lowercaseWords(): List<String> {
    if (this.isNullOrBlank()) {
        return listOf()
    }

    return this.split("\\s+".toRegex())
        .map { it.trim().lowercase() }
        .filter { it.isNotBlank() }
}
