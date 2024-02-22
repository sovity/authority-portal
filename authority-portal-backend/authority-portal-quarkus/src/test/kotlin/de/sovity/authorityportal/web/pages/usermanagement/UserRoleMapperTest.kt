package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserRoleDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRoleMapperTest {

    @Test
    fun testGetHighestRolesAll() {
        assertThat(UserRoleMapper().getHighestRoles(setOf(
            UserRoleDto.OPERATOR_ADMIN,
            UserRoleDto.SERVICE_PARTNER_ADMIN,
            UserRoleDto.AUTHORITY_ADMIN,
            UserRoleDto.AUTHORITY_USER,
            UserRoleDto.ADMIN,
            UserRoleDto.KEY_USER,
            UserRoleDto.USER
        ))).isEqualTo(listOf(
            UserRoleDto.AUTHORITY_ADMIN,
            UserRoleDto.OPERATOR_ADMIN,
            UserRoleDto.SERVICE_PARTNER_ADMIN,
            UserRoleDto.ADMIN
        ))
    }

    @Test
    fun testGetHighestRolesEmpty() {
        assertThat(UserRoleMapper().getHighestRoles(setOf())).isEmpty()
    }
}
