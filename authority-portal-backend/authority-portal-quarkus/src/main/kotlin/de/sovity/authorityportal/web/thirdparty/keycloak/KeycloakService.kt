package de.sovity.authorityportal.web.thirdparty.keycloak

import de.sovity.authorityportal.web.thirdparty.keycloak.model.ApplicationRole
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.WebApplicationException
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.UserResource
import org.keycloak.models.UserModel.RequiredAction
import org.keycloak.representations.idm.GroupRepresentation
import org.keycloak.representations.idm.UserRepresentation

@ApplicationScoped
class KeycloakService {

    @Inject
    lateinit var keycloak: Keycloak

    @Inject
    lateinit var keycloakUserMapper: KeycloakUserMapper

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    lateinit var keycloakRealm: String

    fun createUser(email: String, firstName: String, lastName: String): KeycloakUserDto {
        val user = UserRepresentation().also {
            it.isEnabled = true
            it.requiredActions = listOf(
                RequiredAction.UPDATE_PASSWORD.toString(),
                RequiredAction.CONFIGURE_TOTP.toString(),
                RequiredAction.VERIFY_EMAIL.toString()
            )
            it.email = email
            it.firstName = firstName
            it.lastName = lastName
        }

        val response = keycloak.realm(keycloakRealm).users().create(user)

        if (response.status == Response.Status.CONFLICT.statusCode) {
            throw WebApplicationException("User already exists", response.status)
        }
        return keycloak.realm(keycloakRealm).users().search(email).first()
            .let { keycloakUserMapper.buildKeycloakUserDto(it) }
    }

    fun deactivateUser(userId: String) {
        setUserEnabled(userId, false)
    }

    fun reactivateUser(userId: String) {
        setUserEnabled(userId, true)
    }

    private fun setUserEnabled(userId: String, enabled: Boolean) {
        val user = getUserResource(userId).toRepresentation()
        user.isEnabled = enabled
        getUserResource(userId).update(user)
    }

    fun listUsers(): List<KeycloakUserDto> {
        val users = keycloak.realm(keycloakRealm).users().list()

        return users.map {
            keycloakUserMapper.buildKeycloakUserDto(it)
        }
    }

    fun getUsers(): List<KeycloakUserDto> {
        val users = keycloak.realm(keycloakRealm).users().list()

        return users.map {
            keycloakUserMapper.buildKeycloakUserDto(it)
        }
    }

    fun updateUser(userId: String, firstName: String, lastName: String) {
        val keycloakUserResource = getUserResource(userId)
        val keycloakUser = keycloakUserResource.toRepresentation()
        keycloakUser.firstName = firstName
        keycloakUser.lastName = lastName

        keycloakUserResource.update(keycloakUser)
    }

    /**
     * Retrieves the effective realm-level roles for a user specified by [userId].
     *
     * This function uses Keycloak to retrieve the effective realm-level roles for the specified user.
     * It filters the roles to include only those starting with "UR_" or "AR_".
     *
     * @param userId The ID of the user for whom to retrieve roles.
     * @return A set of strings representing the effective realm-level roles for the user.
     * @see keycloak.realm
     * @see RoleRepresentation
     */
    fun getUserRoles(userId: String): Set<String> {
        return getUserResource(userId).roles().realmLevel()
            .listEffective()
            .filter { it.name.startsWith("UR_") || it.name.startsWith("AR_") }
            .map { it.name }
            .toSet()
    }

    fun createOrganization(mdsId: String) {
        val organization = GroupRepresentation().apply {
            name = mdsId
        }

        // Create organization group
        keycloak.realm(keycloakRealm).groups().add(organization)

        // Create role-based subgroups
        val orgGroupId = keycloak.realm(keycloakRealm).groups()
            .groups(organization.name, 0, 1).firstOrNull()!!.id

        OrganizationRole.values().forEach {
            val subGroup = GroupRepresentation().apply {
                name = it.kcSubGroupName
            }
            keycloak.realm(keycloakRealm).groups().group(orgGroupId).subGroup(subGroup)
        }

        // Add roles to subgroups
        val subGroupIds = keycloak.realm(keycloakRealm).groups()
            .group(orgGroupId).toRepresentation().subGroups.associate { it.name to it.id }
        val roles = keycloak.realm(keycloakRealm).roles().list().associateBy { it.name }

        OrganizationRole.values().forEach {
            val subGroupId = subGroupIds[it.kcSubGroupName]!!
            val role = roles[it.userRole]!!

            keycloak.realm(keycloakRealm).groups().group(subGroupId)
                .roles().realmLevel().add(listOf(role))
        }
    }

    /**
     * Join the user to the organization.
     * Can also be used to change the user's role in the organization.
     *
     * @param userId The user's ID
     * @param mdsId The organization's MDS-ID
     * @param role The user's role in the organization
     */
    fun joinOrganization(userId: String, mdsId: String, role: OrganizationRole) {
        val user = getUserResource(userId)
        val orgGroupId = keycloak.realm(keycloakRealm).groups()
            .groups(mdsId, 0, 1).firstOrNull()!!.id
        val subGroupIds = keycloak.realm(keycloakRealm).groups()
            .group(orgGroupId).toRepresentation().subGroups.associate { it.name to it.id }

        OrganizationRole.values().forEach {
            val subGroupId = subGroupIds[it.kcSubGroupName]!!

            if (it == role) {
                user.joinGroup(subGroupId)
            } else {
                user.leaveGroup(subGroupId)
            }
        }
    }

    /**
     * Join the user to an authority role group.
     * Can also be used to change the user's role in the authority.
     *
     * @param userId The user's ID
     * @param role The user's role in the authority
     */
    fun joinApplicationRole(userId: String, role: ApplicationRole) {
        val user = getUserResource(userId)

        ApplicationRole.values().forEach {
            val roleGroupId = keycloak.realm(keycloakRealm).groups()
                .groups(it.kcGroupName, 0, 1).firstOrNull()!!.id

            if (it == role) {
                user.joinGroup(roleGroupId)
            } else {
                user.leaveGroup(roleGroupId)
            }
        }
    }

    fun forceLogout(userId: String) {
        getUserResource(userId).logout()
    }

    fun sendInvitationEmail(userId: String) {
        val actions = listOf(
            RequiredAction.UPDATE_PASSWORD.toString(),
            RequiredAction.CONFIGURE_TOTP.toString(),
            RequiredAction.VERIFY_EMAIL.toString()
        )
        getUserResource(userId).executeActionsEmail(actions)
    }

    private fun getUserResource(userId: String): UserResource =
        keycloak.realm(keycloakRealm).users().get(userId)
}


