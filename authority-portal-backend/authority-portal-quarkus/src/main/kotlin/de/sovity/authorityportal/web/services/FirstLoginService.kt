package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class FirstLoginService {

    @Inject
    lateinit var organizationService: OrganizationService

    fun approveIfInvited(user: UserRecord) {
        if (user.registrationStatus == UserRegistrationStatus.INVITED) {
            user.registrationStatus = UserRegistrationStatus.ACTIVE
            user.update()

            // Check if user is Participant Admin of an invited organization
            val organization = organizationService.getOrganizationOrThrow(user.organizationMdsId)
            if (organization.registrationStatus == OrganizationRegistrationStatus.INVITED && organization.createdBy == user.id) {
                organization.registrationStatus = OrganizationRegistrationStatus.ACTIVE
                organization.update()
            }
        }
    }
}
