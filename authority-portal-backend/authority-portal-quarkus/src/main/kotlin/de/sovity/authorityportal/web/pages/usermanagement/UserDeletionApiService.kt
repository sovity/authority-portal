package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.PossibleCreatorSuccessor
import de.sovity.authorityportal.api.model.UserDeletionCheck
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.web.pages.centralcomponentmanagement.CentralComponentManagementApiService
import de.sovity.authorityportal.web.pages.connectormanagement.ConnectorManagementApiService
import de.sovity.authorityportal.web.services.CentralComponentService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserDeletionApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var centralComponentService: CentralComponentService

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService

    @Inject
    lateinit var centralComponentManagementApiService: CentralComponentManagementApiService

    fun checkUserDeletion(userId: String): UserDeletionCheck {
        val user = userService.getUserOrThrow(userId)
        val organization = organizationService.getOrganizationOrThrow(user.organizationMdsId)
        val authorityAdmins = keycloakService.getAuthorityAdmins()
        val participantAdmins = keycloakService.getParticipantAdmins(organization.mdsId)

        val userDeletionCheck = UserDeletionCheck().apply {
            this.userId = userId
            canBeDeleted = authorityAdmins.size > 1 || authorityAdmins.first().userId != userId
            isLastParticipantAdmin = participantAdmins.size == 1 && participantAdmins.first().userId == userId
            isOrganizationCreator = organization.createdBy == userId
        }

        if (!userDeletionCheck.isLastParticipantAdmin && userDeletionCheck.isOrganizationCreator) {
            userDeletionCheck.possibleSuccessors = participantAdmins.map {
                val successor = PossibleCreatorSuccessor()
                successor.userId = it.userId
                successor.firstName = it.firstName
                successor.lastName = it.lastName
                successor
            }
            userDeletionCheck.possibleSuccessors.removeIf { it.userId == userId }
        } else {
            userDeletionCheck.possibleSuccessors = emptyList()
        }

        return userDeletionCheck
    }
    fun handleUserDeletion(userId: String, successorUserId: String?, adminUserId: String): IdResponse {
        val userDeletionCheck = checkUserDeletion(userId)
        val user = userService.getUserOrThrow(userId)
        val organization = organizationService.getOrganizationOrThrow(user.organizationMdsId)

        if (!userDeletionCheck.canBeDeleted) {
            Log.error("User can not be deleted. The reason could be, that they are the last Authority Admin. userId=$userId, adminUserId=$adminUserId.")
            error("User can not be deleted. The reason could be, that they are the last Authority Admin.")
        }

        if (userDeletionCheck.isLastParticipantAdmin) {
            deleteOrganizationAndDependencies(organization, adminUserId)
        } else {
            deleteUserAndHandleDependencies(userDeletionCheck, successorUserId, userId, adminUserId, organization)
        }

        return IdResponse(userId)
    }

    private fun deleteOrganizationAndDependencies(organization: OrganizationRecord, adminUserId: String) {
        connectorManagementApiService.deleteAllOrganizationConnectors(organization.mdsId)
        connectorService.deleteProviderReferences(organization.mdsId)
        centralComponentManagementApiService.deleteAllOrganizationCentralComponents(organization.mdsId)

        val orgMemberIds = userService.getUsersByMdsId(organization.mdsId).map { it.id }
        userService.deleteInvitationReferencesToOrgMembers(orgMemberIds)
        userService.deleteMdsIds(orgMemberIds)

        keycloakService.deleteOrganization(organization.mdsId)
        organizationService.deleteOrganization(organization.mdsId)
        keycloakService.deleteUsers(orgMemberIds)
        userService.deleteUsersByMdsId(organization.mdsId)

        Log.info("Organization and related users, connectors and central components deleted. " +
            "mdsId=${organization.mdsId}, adminUserId=$adminUserId.")
    }

    private fun deleteUserAndHandleDependencies(
        userDeletionCheck: UserDeletionCheck,
        successorUserId: String?,
        userId: String,
        adminUserId: String,
        organization: OrganizationRecord
    ) {
        if (userDeletionCheck.isOrganizationCreator) {
            changeOrganizationCreator(successorUserId, userId, adminUserId, organization)
        }
        connectorService.updateConnectorsCreator(organization.createdBy, userId)
        centralComponentService.updateCentralComponentsCreator(organization.createdBy, userId)
        keycloakService.deleteUser(userId)
        userService.deleteInvitationReference(userId)
        userService.deleteUser(userId)

        Log.info("User deleted. Ownership of connectors and central components handed over to organization creator. " +
                "userId=$userId, organizationCreator=${organization.createdBy}, adminUserId=$adminUserId.")
    }

    private fun changeOrganizationCreator(
        successorUserId: String?,
        userId: String,
        adminUserId: String,
        organization: OrganizationRecord
    ) {
        if (successorUserId == null) {
            Log.error("Trying to delete organization creator without without a successor. userId=$userId, adminUserId=$adminUserId.")
            error("Trying to delete organization creator without without a successor.")
        }
        organization.createdBy = successorUserId
        organization.update()

        Log.info("Organization creator changed. mdsId=${organization.mdsId}, successorUserId=$successorUserId, adminUserId=$adminUserId.")
    }
}
