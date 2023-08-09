package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.enums.UserRole
import de.sovity.authorityportal.web.services.toDb
import de.sovity.authorityportal.web.services.toDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRoleMapperTest {

    @Test
    fun testUserRoleMappings() {
        assertThat(UserRole.USER.toDto()).isEqualTo(UserRoleDto.USER)
        assertThat(UserRole.ADMIN.toDto()).isEqualTo(UserRoleDto.ADMIN)

        assertThat(UserRoleDto.USER.toDb()).isEqualTo(UserRole.USER)
        assertThat(UserRoleDto.ADMIN.toDb()).isEqualTo(UserRole.ADMIN)
    }
}
