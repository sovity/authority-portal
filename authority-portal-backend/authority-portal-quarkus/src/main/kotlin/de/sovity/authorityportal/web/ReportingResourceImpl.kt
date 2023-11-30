package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.ReportingResource
import de.sovity.authorityportal.web.auth.AuthUtils
import de.sovity.authorityportal.web.auth.LoggedInUser
import de.sovity.authorityportal.web.pages.connectormanagement.ConnectorCsvApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserDetailsCsvApiService
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import jakarta.ws.rs.core.HttpHeaders.CONTENT_DISPOSITION
import jakarta.ws.rs.core.Response

class ReportingResourceImpl : ReportingResource {

    @Inject
    lateinit var authUtils: AuthUtils

    @Inject
    lateinit var userDetailsCsvApiService: UserDetailsCsvApiService

    @Inject
    lateinit var connectorCsvApiService: ConnectorCsvApiService

    @Inject
    lateinit var loggedInUser: LoggedInUser

    @Transactional
    override fun downloadOwnOrganizationConnectorsCsv(environmentId: String): Response {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.AUTHORITY_USER)
        val mdsId = loggedInUser.organizationMdsId!!
        return Response
            .ok(connectorCsvApiService.generateConnectorCsv(mdsId, environmentId))
            .header(CONTENT_DISPOSITION, "attachment; filename=$mdsId" + "_$environmentId.csv")
            .build()
    }

    @Transactional
    override fun downloadConnectorsCsv(mdsId: String, environmentId: String): Response {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.AUTHORITY_USER)
        return Response
            .ok(connectorCsvApiService.generateConnectorCsv(mdsId, environmentId))
            .header(CONTENT_DISPOSITION, "attachment; filename=$mdsId" + "_$environmentId.csv")
            .build()
    }

    @Transactional
    override fun ownOrganizationUserReportingDetails(): Response {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.AUTHORITY_USER)
        val mdsId = loggedInUser.organizationMdsId!!
        return Response
            .ok(userDetailsCsvApiService.generateUserDetailsCsv(mdsId))
            .header(CONTENT_DISPOSITION, "attachment; filename=User_details_$mdsId.csv")
            .build()
    }

    @Transactional
    override fun userReportingDetails(mdsId: String): Response {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.AUTHORITY_USER)
        return Response
            .ok(userDetailsCsvApiService.generateUserDetailsCsv(mdsId))
            .header(CONTENT_DISPOSITION, "attachment; filename=User_details_$mdsId.csv")
            .build()
    }
}
