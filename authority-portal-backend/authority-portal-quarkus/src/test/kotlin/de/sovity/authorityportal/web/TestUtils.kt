package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.auth.LoggedInUser
import io.quarkus.test.junit.QuarkusMock
import org.assertj.core.api.RecursiveComparisonAssert
import org.mockito.kotlin.mock
import java.time.OffsetDateTime

inline fun <reified T : Any> installMockitoMock(): T {
    return installMock(mock<T>())
}

inline fun <reified T> installMock(mock: T): T {
    QuarkusMock.installMockForType(mock, T::class.java)
    return mock
}

fun <T : RecursiveComparisonAssert<T>> RecursiveComparisonAssert<T>.withOffsetDateTimeComparator(): RecursiveComparisonAssert<T> {
    return withEqualsForType({ a, b -> a.toInstant() == b.toInstant() }, OffsetDateTime::class.java)
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
