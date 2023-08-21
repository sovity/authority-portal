package de.sovity.authorityportal.web.services.pages.userapproval

import de.sovity.authorityportal.api.model.UserApprovalPageListEntryDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserApprovalPageUserMapper {
    fun buildUserListEntry(user: KeycloakUserDto): UserApprovalPageListEntryDto {
        val userDto = UserApprovalPageListEntryDto()

        userDto.userId = user.userId
        userDto.email = user.email
        userDto.firstName = user.firstName
        userDto.lastName = user.lastName
        userDto.position = user.position
        userDto.phoneNumber = user.phoneNumber

        return userDto
    }
}
