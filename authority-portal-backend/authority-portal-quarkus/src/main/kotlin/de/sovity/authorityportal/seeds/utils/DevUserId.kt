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

package de.sovity.authorityportal.seeds.utils

import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneOffset

/**
 * Our Dev User IDs also need to be UUIDs, as they are expected to exist in the keycloak.
 */
fun dummyDevUserUuid(i: Int): String = "00000000-0000-0000-0000-${i.toString().padStart(12, '0')}"
fun dummyDevMdsId(i: Int): String = "MDSL${i.toString().padStart(6, '0')}"
fun dummyDevConnectorId(i: Int): String = "CONN${i.toString().padStart(3, '0')}"
fun dummyDevAssetId(i: Int): String = "ASSET-${i.toString().padStart(8, '0')}"
fun dummyDate(i: Int): OffsetDateTime = LocalDate.parse("2024-01-01").atStartOfDay().atOffset(ZoneOffset.UTC).plusDays(i.toLong())
fun dummyDevContractOfferId(i: Int): String = "COFFER-${i.toString().padStart(8, '0')}"
