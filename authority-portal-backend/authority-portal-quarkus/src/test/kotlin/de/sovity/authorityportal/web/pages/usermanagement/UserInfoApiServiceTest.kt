package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserDetail
import de.sovity.authorityportal.web.services.UserDetailService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.OffsetDateTime

@ExtendWith(MockitoExtension::class)
class UserInfoApiServiceTest {

    @InjectMocks
    lateinit var userInfoApiService: UserInfoApiService

    @Mock
    lateinit var userDetailService: UserDetailService

    @Mock
    lateinit var userRoleMapper: UserRoleMapper

    @Test
    fun testUserDetails() {
        // arrange
        val userId = "123"
        val userEmail = "john.doe@example.com"
        val user = UserDetail(userId, "Test", "Test", userEmail, null, null, null,
            UserRegistrationStatus.ACTIVE, OffsetDateTime.now(), setOf("UR_AUTHORITY-PORTAL_AUTHORITY-USER", "UR_AUTHORITY-PORTAL_PARTICIPANT-CURATOR"))
        `when`(userDetailService.getUserDetails(userId)).thenReturn(user)

        // act
        val userDetails = userInfoApiService.userDetails(userId)

        // assert
        assertEquals(userEmail, userDetails.email)
        assertEquals(UserRegistrationStatusDto.ACTIVE, userDetails.registrationStatus)
    }
}
