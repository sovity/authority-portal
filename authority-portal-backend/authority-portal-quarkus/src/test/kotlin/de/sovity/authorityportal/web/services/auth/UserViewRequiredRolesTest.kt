package de.sovity.authorityportal.web.services.auth

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserViewRequiredRolesTest {

    @Test
    fun testUserViewRequiredRoles() {
        // arrange
        val roleName = "TEST-ROLE"
        val expectedSelf = "${roleName}_SELF"
        val expectedOrganization = "${roleName}_ORGANIZATION"
        val expectedGlobal = "${roleName}_GLOBAL"

        // act
        val result = UserViewRequiredRoles(roleName)

        // assert
        assertThat(result.self).isEqualTo(expectedSelf)
        assertThat(result.organization).isEqualTo(expectedOrganization)
        assertThat(result.global).isEqualTo(expectedGlobal)
    }
}
