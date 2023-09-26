package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.pages.userregistration.toDb
import de.sovity.authorityportal.web.pages.userregistration.toDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRegistrationStatusMapperTest {

    @Test
    fun testUserRegistrationStatusMapper() {
        assertThat(UserRegistrationStatus.CREATED.toDto()).isEqualTo(UserRegistrationStatusDto.CREATED)
        assertThat(UserRegistrationStatus.PENDING.toDto()).isEqualTo(UserRegistrationStatusDto.PENDING)
        assertThat(UserRegistrationStatus.APPROVED.toDto()).isEqualTo(UserRegistrationStatusDto.APPROVED)
        assertThat(UserRegistrationStatus.REJECTED.toDto()).isEqualTo(UserRegistrationStatusDto.REJECTED)

        assertThat(UserRegistrationStatusDto.CREATED.toDb()).isEqualTo(UserRegistrationStatus.CREATED)
        assertThat(UserRegistrationStatusDto.PENDING.toDb()).isEqualTo(UserRegistrationStatus.PENDING)
        assertThat(UserRegistrationStatusDto.APPROVED.toDb()).isEqualTo(UserRegistrationStatus.APPROVED)
        assertThat(UserRegistrationStatusDto.REJECTED.toDb()).isEqualTo(UserRegistrationStatus.REJECTED)
    }
}
