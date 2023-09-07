package de.sovity.authorityportal.web.services.db

import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserDetailService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    fun getUserData(userId: String): UserDetail {
        val kcUser = keycloakService.getUser(userId)
        val dbUser = userService.getUserOrThrow(userId)

        return UserDetail(
            kcUser.userId,
            kcUser.firstName,
            kcUser.lastName,
            kcUser.email,
            kcUser.position,
            kcUser.phoneNumber,
            dbUser.organizationMdsId,
            dbUser.registrationStatus
        )
    }
}
