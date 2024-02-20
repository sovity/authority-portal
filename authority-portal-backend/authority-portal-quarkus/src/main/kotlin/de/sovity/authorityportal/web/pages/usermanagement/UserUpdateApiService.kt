package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.OnboardingUserUpdateDto
import de.sovity.authorityportal.api.model.UpdateUserDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserUpdateApiService {

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var keycloakService: KeycloakService

    fun updateUserDetails(userId: String, updateUserDto: UpdateUserDto): IdResponse {
        val user = userService.getUserOrThrow(userId)
        user.firstName = updateUserDto.firstName
        user.lastName = updateUserDto.lastName
        user.phone = updateUserDto.phone
        user.jobTitle = updateUserDto.jobTitle
        user.email = updateUserDto.email
        user.update()
        keycloakService.updateUser(userId, updateUserDto.firstName, updateUserDto.lastName, updateUserDto.email)
        return IdResponse(userId)
    }

    fun updateOnboardingUserDetails(userId: String, onboardingUserUpdateDto: OnboardingUserUpdateDto): IdResponse {
        val user = userService.getUserOrThrow(userId)
        user.firstName = onboardingUserUpdateDto.firstName
        user.lastName = onboardingUserUpdateDto.lastName
        user.phone = onboardingUserUpdateDto.phoneNumber
        user.jobTitle = onboardingUserUpdateDto.jobTitle
        user.registrationStatus = UserRegistrationStatus.ACTIVE
        user.update()
        keycloakService.updateUser(userId, onboardingUserUpdateDto.firstName, onboardingUserUpdateDto.lastName, null)
        return IdResponse(userId)
    }
}
