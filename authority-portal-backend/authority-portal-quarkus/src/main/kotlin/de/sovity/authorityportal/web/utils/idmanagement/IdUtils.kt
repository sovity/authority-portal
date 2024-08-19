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

package de.sovity.authorityportal.web.utils.idmanagement

import jakarta.enterprise.context.ApplicationScoped
import kotlin.random.Random

@ApplicationScoped
class IdUtils {

    private val charPool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    fun randomIdentifier(length: Int) =
        (1..length).map { Random.nextInt(0, charPool.length).let { charPool[it] } }.joinToString("")

    fun calculateVerificationDigits(id: String): String {
        val m = 1271
        val r = 36
        val input = id.uppercase()

        var product = 0
        for (char in input) {
            val value = charPool.indexOf(char)
            product = ((product + value) * r) % m
        }

        product = (product * r) % m
        val checksum = (m - product + 1) % m
        val secondDigit = checksum % r
        val firstDigit = (checksum - secondDigit) / r

        return charPool[firstDigit].toString() + charPool[secondDigit].toString()
    }
}
