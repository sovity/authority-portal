package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.UpdateOrganizationDto
import de.sovity.authorityportal.api.model.organization.OnboardingOrganizationUpdateDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.web.services.OrganizationService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationUpdateApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    fun updateOrganizationDetails(mdsId: String, organizationDto: UpdateOrganizationDto): IdResponse {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        organization.url = organizationDto.url
        organization.businessUnit = organizationDto.businessUnit
        organization.address = organizationDto.address
        organization.billingAddress = organizationDto.billingAddress
        organization.mainContactName = organizationDto.mainContactName
        organization.mainContactEmail = organizationDto.mainContactEmail
        organization.mainContactPhone = organizationDto.mainContactPhone
        organization.techContactName = organizationDto.techContactName
        organization.techContactEmail = organizationDto.techContactEmail
        organization.techContactPhone = organizationDto.techContactPhone
        organization.update()
        return IdResponse(mdsId)
    }

    fun updateOnboardingOrganizationDetails(mdsId: String, onboardingOrganizationUpdateDto: OnboardingOrganizationUpdateDto): IdResponse {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        organization.name = onboardingOrganizationUpdateDto.name
        organization.url = onboardingOrganizationUpdateDto.url
        organization.businessUnit = onboardingOrganizationUpdateDto.businessUnit
        organization.address = onboardingOrganizationUpdateDto.address
        organization.billingAddress = onboardingOrganizationUpdateDto.billingAddress
        organization.mainContactName = onboardingOrganizationUpdateDto.mainContactName
        organization.mainContactEmail = onboardingOrganizationUpdateDto.mainContactEmail
        organization.mainContactPhone = onboardingOrganizationUpdateDto.mainContactPhone
        organization.techContactName = onboardingOrganizationUpdateDto.techContactName
        organization.techContactEmail = onboardingOrganizationUpdateDto.techContactEmail
        organization.techContactPhone = onboardingOrganizationUpdateDto.techContactPhone
        organization.registrationStatus = OrganizationRegistrationStatus.ACTIVE
        organization.update()
        return IdResponse(mdsId)
    }


}
