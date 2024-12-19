package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.web.services.OrganizationDeletionService
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class OrganizationDeletionApiService(
    var organizationDeletionService: OrganizationDeletionService,
    var timeUtils: TimeUtils
) {

    fun deleteOrganizationAndDependencies(organizationId: String, adminUserId: String): IdResponse {
        organizationDeletionService.deleteOrganizationAndDependencies(organizationId, adminUserId)

        return IdResponse(organizationId, timeUtils.now())
    }
}
