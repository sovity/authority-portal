package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRegistrationStatusMapperTest {

    @Test
    fun testUserRegistrationStatusMapper() {
        assertThat(UserRegistrationStatus.CREATED.toDto()).isEqualTo(UserRegistrationStatusDto.CREATED)
        assertThat(UserRegistrationStatus.PENDING.toDto()).isEqualTo(UserRegistrationStatusDto.PENDING)
        assertThat(UserRegistrationStatus.ACTIVE.toDto()).isEqualTo(UserRegistrationStatusDto.ACTIVE)
        assertThat(UserRegistrationStatus.REJECTED.toDto()).isEqualTo(UserRegistrationStatusDto.REJECTED)

        assertThat(UserRegistrationStatusDto.CREATED.toDb()).isEqualTo(UserRegistrationStatus.CREATED)
        assertThat(UserRegistrationStatusDto.PENDING.toDb()).isEqualTo(UserRegistrationStatus.PENDING)
        assertThat(UserRegistrationStatusDto.ACTIVE.toDb()).isEqualTo(UserRegistrationStatus.ACTIVE)
        assertThat(UserRegistrationStatusDto.REJECTED.toDb()).isEqualTo(UserRegistrationStatus.REJECTED)
    }
}
