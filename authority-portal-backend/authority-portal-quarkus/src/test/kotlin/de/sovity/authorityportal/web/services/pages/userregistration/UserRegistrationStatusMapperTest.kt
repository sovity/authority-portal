package de.sovity.authorityportal.web.services.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRegistrationStatusMapperTest {

    @Test
    fun testUserRegistrationStatusMapper() {
        assertThat(UserRegistrationStatus.CREATED.toDto()).isEqualTo(UserRegistrationStatusDto.CREATED)
        assertThat(UserRegistrationStatus.ORGANIZATION_CREATED.toDto()).isEqualTo(UserRegistrationStatusDto.ORGANIZATION_CREATED)
        assertThat(UserRegistrationStatus.PENDING.toDto()).isEqualTo(UserRegistrationStatusDto.PENDING)
        assertThat(UserRegistrationStatus.APPROVED.toDto()).isEqualTo(UserRegistrationStatusDto.APPROVED)
        assertThat(UserRegistrationStatus.REJECTED.toDto()).isEqualTo(UserRegistrationStatusDto.REJECTED)
        assertThat(UserRegistrationStatus.UNKNOWN.toDto()).isEqualTo(UserRegistrationStatusDto.UNKNOWN)

        assertThat(UserRegistrationStatusDto.CREATED.toKc()).isEqualTo(UserRegistrationStatus.CREATED)
        assertThat(UserRegistrationStatusDto.ORGANIZATION_CREATED.toKc()).isEqualTo(UserRegistrationStatus.ORGANIZATION_CREATED)
        assertThat(UserRegistrationStatusDto.PENDING.toKc()).isEqualTo(UserRegistrationStatus.PENDING)
        assertThat(UserRegistrationStatusDto.APPROVED.toKc()).isEqualTo(UserRegistrationStatus.APPROVED)
        assertThat(UserRegistrationStatusDto.REJECTED.toKc()).isEqualTo(UserRegistrationStatus.REJECTED)
        assertThat(UserRegistrationStatusDto.UNKNOWN.toKc()).isEqualTo(UserRegistrationStatus.UNKNOWN)
    }
}
