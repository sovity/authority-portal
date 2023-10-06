package de.sovity.authorityportal.web.thirdparty.keycloak

import de.sovity.authorityportal.web.thirdparty.keycloak.model.ApplicationRole
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.keycloak.admin.client.Keycloak
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

    fun createUser(email: String, firstName: String, lastName: String): String {
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

        keycloak.realm(keycloakRealm).users().create(user)

        return keycloak.realm(keycloakRealm).users().search(email).first().id
    }

    fun deactivateUser(userId: String) {
        setUserEnabled(userId, false)
    }

    fun reactivateUser(userId: String) {
        setUserEnabled(userId, true)
    }

    private fun setUserEnabled(userId: String, enabled: Boolean) {
        val user = keycloak.realm(keycloakRealm).users().get(userId).toRepresentation()
        user.isEnabled = enabled
        keycloak.realm(keycloakRealm).users().get(userId).update(user)
    }

    fun listUsers(): List<KeycloakUserDto> {
        val users = keycloak.realm(keycloakRealm).users().list()

        return users.map {
            keycloakUserMapper.buildKeycloakUserDto(it)
        }
    }

    fun getUser(userId: String): KeycloakUserDto {
        // TODO: handle not found (maybe try/catch => User?)
        val user = keycloak.realm(keycloakRealm).users().get(userId).toRepresentation()

        return keycloakUserMapper.buildKeycloakUserDto(user)
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
        val user = keycloak.realm(keycloakRealm).users().get(userId)
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
        val user = keycloak.realm(keycloakRealm).users().get(userId)

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
        keycloak.realm(keycloakRealm).users().get(userId).logout()
    }

    fun sendInvitationEmail(userId: String) {
        val actions = listOf(
            RequiredAction.UPDATE_PASSWORD.toString(),
            RequiredAction.CONFIGURE_TOTP.toString(),
            RequiredAction.VERIFY_EMAIL.toString()
        )
        keycloak.realm(keycloakRealm).users().get(userId).executeActionsEmail(actions)
    }
}


