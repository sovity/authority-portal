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

package de.sovity.authorityportal.web.tests

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.auth.LoggedInUser
import de.sovity.authorityportal.web.utils.TimeUtils
import io.quarkus.test.junit.QuarkusMock
import org.assertj.core.api.RecursiveComparisonAssert
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import java.time.Duration
import java.time.OffsetDateTime

inline fun <reified T : Any> installMockitoMock(): T {
    return installMock(mock<T>())
}

inline fun <reified T> installMock(mock: T): T {
    QuarkusMock.installMockForType(mock, T::class.java)
    return mock
}

fun <T : RecursiveComparisonAssert<T>> RecursiveComparisonAssert<T>.withOffsetDateTimeComparator(): RecursiveComparisonAssert<T> {
    return withEqualsForType({ a, b -> Duration.between(a, b).abs().nano < 1_000_000 }, OffsetDateTime::class.java)
}

fun useDevUser(userUuidNr: Int, mdsIdNr: Int?, roles: Set<String> = setOf(Roles.UserRoles.AUTHORITY_ADMIN)) {
    val loggedInUser = LoggedInUser(
        authenticated = true,
        userId = dummyDevUserUuid(userUuidNr),
        organizationMdsId = mdsIdNr?.let { dummyDevMdsId(it) },
        roles = roles
    )
    installMock(loggedInUser)
}

fun useUnauthenticated() {
    val loggedInUser = LoggedInUser(
        authenticated = false,
        userId = "",
        organizationMdsId = null,
        roles = setOf(UserRoleDto.UNAUTHENTICATED.name)
    )
    installMock(loggedInUser)
}

fun useMockNow(now: OffsetDateTime) {
    val timeUtils = installMockitoMock<TimeUtils>()
    whenever(timeUtils.now()).thenReturn(now)
}

inline fun <reified T> T.loadTestResource(name: String): String {
    val fullPath = "/${T::class.simpleName}/$name"
    return T::class.java.getResourceAsStream(fullPath)?.reader()
        .use { it?.readText() ?: error("Can't read resource $fullPath") }
}
