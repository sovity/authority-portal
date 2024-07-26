/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

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
import de.sovity.authorityportal.web.utils.TimeUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserDeletionApiService(
    val keycloakService: KeycloakService,
    val userService: UserService,
    val organizationService: OrganizationService,
    val connectorService: ConnectorService,
    val centralComponentService: CentralComponentService,
    val connectorManagementApiService: ConnectorManagementApiService,
    val centralComponentManagementApiService: CentralComponentManagementApiService,
    val timeUtils: TimeUtils
) {

    fun checkUserDeletion(userId: String): UserDeletionCheck {
        val user = userService.getUserOrThrow(userId)
        val organization = organizationService.getOrganizationOrThrow(user.organizationId)
        val authorityAdmins = keycloakService.getAuthorityAdmins()
        val participantAdmins = keycloakService.getParticipantAdmins(organization.id)

        val isLastAuthorityAdmin = authorityAdmins.singleOrNull()?.userId == userId
        val isLastParticipantAdmin = participantAdmins.singleOrNull()?.userId == userId
        val isOrganizationCreator = organization.createdBy == userId

        var possibleCreatorSuccessors = listOf<PossibleCreatorSuccessor>()
        if (!isLastParticipantAdmin && isOrganizationCreator) {
            possibleCreatorSuccessors = participantAdmins
                .filter { it.userId != userId }
                .map {
                    PossibleCreatorSuccessor(
                        userId = it.userId,
                        firstName = it.firstName,
                        lastName = it.lastName
                    )
                }
        }

        val userDeletionCheck = UserDeletionCheck(
            userId = userId,
            canBeDeleted = !isLastAuthorityAdmin,
            isLastParticipantAdmin = isLastParticipantAdmin,
            isOrganizationCreator = isOrganizationCreator,
            possibleCreatorSuccessors = possibleCreatorSuccessors
        )

        return userDeletionCheck
    }

    fun handleUserDeletion(userId: String, successorUserId: String?, adminUserId: String): IdResponse {
        val userDeletionCheck = checkUserDeletion(userId)
        val user = userService.getUserOrThrow(userId)
        val organization = organizationService.getOrganizationOrThrow(user.organizationId)

        if (!userDeletionCheck.canBeDeleted) {
            Log.error("User can not be deleted. The reason could be, that they are the last Authority Admin. userId=$userId, adminUserId=$adminUserId.")
            error("User can not be deleted. The reason could be, that they are the last Authority Admin.")
        }

        if (userDeletionCheck.isLastParticipantAdmin) {
            deleteOrganizationAndDependencies(organization.id, adminUserId)
        } else {
            deleteUserAndHandleDependencies(userDeletionCheck, successorUserId, userId, adminUserId, organization)
        }

        return IdResponse(userId, timeUtils.now())
    }

    private fun deleteOrganizationAndDependencies(organizationId: String, adminUserId: String) {
        connectorManagementApiService.deleteAllOrganizationConnectors(organizationId)
        connectorService.deleteProviderReferences(organizationId)
        centralComponentManagementApiService.deleteAllOrganizationCentralComponents(organizationId)

        val orgMemberIds = userService.getUsersByOrganizationId(organizationId).map { it.id }
        userService.deleteInvitationReferencesToOrgMembers(orgMemberIds)
        userService.deleteOrganizationIds(orgMemberIds)

        keycloakService.deleteOrganization(organizationId)
        organizationService.deleteOrganization(organizationId)
        keycloakService.deleteUsers(orgMemberIds)
        userService.deleteUsers(orgMemberIds)

        Log.info(
            "Organization and related users, connectors and central components deleted. " +
                "organization=${organizationId}, adminUserId=$adminUserId."
        )
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

        Log.info(
            "User deleted. Ownership of connectors and central components handed over to organization creator. " +
                "userId=$userId, organizationCreator=${organization.createdBy}, adminUserId=$adminUserId."
        )
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

        Log.info("Organization creator changed. organizationId=${organization.id}, successorUserId=$successorUserId, adminUserId=$adminUserId.")
    }
}
