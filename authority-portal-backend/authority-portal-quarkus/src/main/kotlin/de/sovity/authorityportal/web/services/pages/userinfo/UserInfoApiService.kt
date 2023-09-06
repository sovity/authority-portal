package de.sovity.authorityportal.web.services.pages.userinfo

import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.web.services.db.OrganizationService
import de.sovity.authorityportal.web.services.pages.userregistration.toDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserInfoApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    fun userInfo(userId: String): UserInfo {
        val user = keycloakService.getUser(userId)
        val organizationMdsId = getMdsId(userId)
        val organizationName = getOrganization(organizationMdsId)
        val roles = userRoleMapper.getUserRoles(keycloakService.getRolesOfUser(userId))

        return UserInfo(
                user.firstName,
                user.lastName,
                organizationName,
                organizationMdsId,
                roles.toList(),
                user.registrationStatus.toDto()
        )
    }

    private fun getMdsId(userId: String): String? {
        return keycloakService.getOrganizationIdOfUser(userId)
    }

    private fun getOrganization(mdsId: String?): String {
        if (mdsId.isNullOrEmpty()) {
            return ""
        }
        val organization = organizationService.getOrganization(mdsId)

        return organization?.name ?: ""
    }
}
