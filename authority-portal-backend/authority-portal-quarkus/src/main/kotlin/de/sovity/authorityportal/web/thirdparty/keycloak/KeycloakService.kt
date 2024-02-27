package de.sovity.authorityportal.web.thirdparty.keycloak

import de.sovity.authorityportal.web.thirdparty.keycloak.model.ApplicationRole
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.thirdparty.keycloak.model.RequiredAction
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.WebApplicationException
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.CredentialRepresentation
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

    @ConfigProperty(name = "quarkus.keycloak.admin-client.client-id")
    lateinit var keycloakClientId: String

    @ConfigProperty(name = "authority-portal.base-url")
    lateinit var baseUrl: String

    fun createUser(email: String, firstName: String, lastName: String, password: String? = null): String {
        val user = UserRepresentation().also {
            it.isEnabled = true
            it.requiredActions = listOfNotNull(
                RequiredAction.UPDATE_PASSWORD.stringRepresentation.takeIf { password == null },
                RequiredAction.CONFIGURE_TOTP.stringRepresentation,
                RequiredAction.VERIFY_EMAIL.stringRepresentation
            )
            it.email = email
            it.firstName = firstName
            it.lastName = lastName

            if (password != null) {
                it.credentials = listOf(
                    CredentialRepresentation().also {credentials ->
                        credentials.isTemporary = false
                        credentials.type = CredentialRepresentation.PASSWORD
                        credentials.value = password
                    }
                )
            }
        }

        val response = keycloak.realm(keycloakRealm).users().create(user)

        if (response.status == Response.Status.CONFLICT.statusCode) {
            throw WebApplicationException("User already exists", response.status)
        }
        return keycloak.realm(keycloakRealm).users().search(email).first().id
    }

    fun deleteUser(userId: String) {
        keycloak.realm(keycloakRealm).users().delete(userId)
    }

    fun deleteUsers(userIds: List<String>) {
        userIds.forEach { deleteUser(it) }
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

    fun updateUser(userId: String, firstName: String, lastName: String, email: String?) {
        val userResource = keycloak.realm(keycloakRealm).users().get(userId)
        val user = userResource.toRepresentation()
        user.firstName = firstName
        user.lastName = lastName

        if (user != null && user.email != email) {
            user.email = email
            user.isEmailVerified = false
            user.requiredActions = listOf(
                RequiredAction.VERIFY_EMAIL.stringRepresentation
            )
            forceLogout(user.id)
        }

        keycloak.realm(keycloakRealm).users().get(userId).update(user)
    }

    fun getUserRoles(userId: String): Set<String> {
        return keycloak.realm(keycloakRealm).users().get(userId).roles().realmLevel()
            .listEffective()
            .filter { it.name.startsWith("UR_") || it.name.startsWith("AR_") }
            .map { it.name }
            .toSet()
    }

    fun getOrganizationMembers(mdsId: String): List<KeycloakUserDto> {
        val groups = keycloak.realm(keycloakRealm).groups()
        val orgGroupId = groups.groups().find { it.name == mdsId }?.id ?: return emptyList()
        val subGroupIds = getSubGroupIds(orgGroupId).values

        var orgMembers: List<KeycloakUserDto> = emptyList()
        subGroupIds.forEach() { subGroupId ->
            val subGroupMembers = groups.group(subGroupId).members().mapNotNull {
                keycloakUserMapper.buildKeycloakUserDto(it)
            }
            orgMembers = orgMembers.plus(subGroupMembers)
        }

        return orgMembers
    }

    fun getParticipantAdmins(mdsId: String): List<KeycloakUserDto> {
        val groups = keycloak.realm(keycloakRealm).groups()
        val orgGroupId = groups.groups(mdsId, 0, 1).firstOrNull()!!.id
        val subGroupIds = getSubGroupIds(orgGroupId)
        val participantAdminGroupId = subGroupIds[OrganizationRole.PARTICIPANT_ADMIN.kcSubGroupName]

        return groups.group(participantAdminGroupId).members().mapNotNull {
            keycloakUserMapper.buildKeycloakUserDto(it)
        }
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

        OrganizationRole.entries.forEach {
            val subGroup = GroupRepresentation().apply {
                name = it.kcSubGroupName
            }
            keycloak.realm(keycloakRealm).groups().group(orgGroupId).subGroup(subGroup)
        }

        // Add roles to subgroups
        val subGroupIds = getSubGroupIds(orgGroupId)
        val roles = keycloak.realm(keycloakRealm).roles().list().associateBy { it.name }

        OrganizationRole.entries.forEach {
            val subGroupId = subGroupIds[it.kcSubGroupName]!!
            val role = roles[it.userRole]!!

            keycloak.realm(keycloakRealm).groups().group(subGroupId)
                .roles().realmLevel().add(listOf(role))
        }
    }

    fun deleteOrganization(mdsId: String) {
        keycloak.realm(keycloakRealm).groups().groups(mdsId, 0, 1).firstOrNull()?.let {
            keycloak.realm(keycloakRealm).groups().group(it.id).remove()
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
        val subGroupIds = getSubGroupIds(orgGroupId)

        OrganizationRole.entries.forEach {
            val subGroupId = subGroupIds[it.kcSubGroupName]!!

            if (it == role) {
                user.joinGroup(subGroupId)
            } else {
                user.leaveGroup(subGroupId)
            }
        }
    }

    /**
     * Join the user to an application role group.
     * Can also be used to change the user's role in the authority or application.
     *
     * @param userId The user's ID
     * @param role The user's role in the authority
     */
    fun joinApplicationRole(userId: String, role: ApplicationRole) {
        val user = keycloak.realm(keycloakRealm).users().get(userId)

        ApplicationRole.entries.forEach {
            val roleGroupId = keycloak.realm(keycloakRealm).groups()
                .groups(it.kcGroupName, 0, 1).firstOrNull()!!.id

            if (it == role) {
                user.joinGroup(roleGroupId)
            } else {
                user.leaveGroup(roleGroupId)
            }
        }
    }

    fun clearApplicationRole(userId: String) {
        val user = keycloak.realm(keycloakRealm).users().get(userId)

        ApplicationRole.entries.forEach {
            val roleGroupId = keycloak.realm(keycloakRealm).groups()
                .groups(it.kcGroupName, 0, 1).firstOrNull()!!.id

            user.leaveGroup(roleGroupId)
        }
    }

    fun forceLogout(userId: String) {
        keycloak.realm(keycloakRealm).users().get(userId).logout()
        Log.info("Logging out user forcefully. userId: $userId")
    }

    fun sendInvitationEmail(userId: String) {
        val actions = listOf(
            RequiredAction.CONFIGURE_TOTP.stringRepresentation,
            RequiredAction.VERIFY_EMAIL.stringRepresentation
        )
        keycloak.realm(keycloakRealm).users().get(userId).executeActionsEmail(keycloakClientId, baseUrl, actions)
    }

    fun sendInvitationEmailWithPasswordReset(userId: String) {
        val actions = listOf(
            RequiredAction.UPDATE_PASSWORD.stringRepresentation,
            RequiredAction.CONFIGURE_TOTP.stringRepresentation,
            RequiredAction.VERIFY_EMAIL.stringRepresentation
        )
        keycloak.realm(keycloakRealm).users().get(userId).executeActionsEmail(keycloakClientId, baseUrl, actions)
    }

    private fun getSubGroupIds(groupId: String)  =
        keycloak.realm(keycloakRealm).groups().query("", true)
            .first { it.id == groupId }.subGroups.associate { it.name to it.id }
}


