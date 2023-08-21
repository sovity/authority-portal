package de.sovity.authorityportal.web.services.pages.userapproval

import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class UserApprovalPageUserMapperTest {
    @InjectMocks
    lateinit var userApprovalPageUserMapper: UserApprovalPageUserMapper

    @Test
    fun testBuildUserListEntry() {
        // arrange
        val user = KeycloakUserDto(
            userId = "userId",
            firstName = "firstName",
            lastName = "lastName",
            email = "email",
            position = "position",
            phoneNumber = "phoneNumber",
            registrationStatus = UserRegistrationStatus.APPROVED
        )

        // act
        val result = userApprovalPageUserMapper.buildUserListEntry(user)

        // assert
        assertThat(result.userId).isEqualTo("userId")
        assertThat(result.firstName).isEqualTo("firstName")
        assertThat(result.lastName).isEqualTo("lastName")
        assertThat(result.email).isEqualTo("email")
        assertThat(result.position).isEqualTo("position")
        assertThat(result.phoneNumber).isEqualTo("phoneNumber")
    }
}
