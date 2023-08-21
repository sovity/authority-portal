package de.sovity.authorityportal.web.services.thirdparty.keycloak.model

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRegistrationStatusTest {
    @Test
    fun testFromStatusCode() {
        val existing = UserRegistrationStatus.APPROVED
        assertThat(UserRegistrationStatus.fromStatusCode(existing.statusCode)).isEqualTo(existing)
    }

    @Test
    fun testFromStatusCode_Unknown() {
        val unknown = UserRegistrationStatus.UNKNOWN
        assertThat(UserRegistrationStatus.fromStatusCode(-123)).isEqualTo(unknown)
    }
}
