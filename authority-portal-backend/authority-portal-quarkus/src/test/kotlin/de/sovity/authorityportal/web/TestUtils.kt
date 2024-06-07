package de.sovity.authorityportal.web

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
