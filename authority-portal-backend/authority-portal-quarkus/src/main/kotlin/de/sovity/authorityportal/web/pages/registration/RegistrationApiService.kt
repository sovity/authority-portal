package de.sovity.authorityportal.web.pages.registration

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.RegistrationRequestDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.model.CreateOrganizationData
import de.sovity.authorityportal.web.model.CreateUserData
import de.sovity.authorityportal.web.pages.organizationmanagement.toDb
import de.sovity.authorityportal.web.services.FirstUserService
import de.sovity.authorityportal.web.services.OrganizationMetadataService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.utils.idmanagement.MdsIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class RegistrationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var organizationMetadataService: OrganizationMetadataService

    @Inject
    lateinit var mdsIdUtils: MdsIdUtils

    @Inject
    lateinit var firstUserService: FirstUserService

    fun registerUserAndOrganization(registrationRequest: RegistrationRequestDto): IdResponse {
        val mdsId = mdsIdUtils.generateMdsId()
        val userId = createKeycloakUserAndOrganization(mdsId, registrationRequest)
        createDbUserAndOrganization(userId, mdsId, registrationRequest)
        keycloakService.sendInvitationEmail(userId)
        firstUserService.setupFirstUserIfRequired(userId, mdsId)

        Log.info("Register organization and User. mdsId=$mdsId, userId=$userId")

        return IdResponse(userId)
    }

    private fun createKeycloakUserAndOrganization(mdsId: String, registrationRequest: RegistrationRequestDto): String {
        val userId = keycloakService.createUser(
            registrationRequest.userEmail,
            registrationRequest.userFirstName,
            registrationRequest.userLastName,
            registrationRequest.userPassword
        )
        keycloakService.createOrganization(mdsId)
        keycloakService.joinOrganization(userId, mdsId, OrganizationRole.PARTICIPANT_ADMIN)

        return userId
    }

    private fun createDbUserAndOrganization(userId: String, mdsId: String, registrationRequest: RegistrationRequestDto) {
        val user = userService.createUser(
            userId = userId,
            userData = buildUserData(registrationRequest),
            onboardingType = UserOnboardingType.SELF_REGISTRATION
        )
        organizationService.createOrganization(
            userId,
            mdsId,
            buildOrganizationData(registrationRequest),
            OrganizationRegistrationStatus.PENDING
        )
        user.organizationMdsId = mdsId
        user.update()

        organizationMetadataService.pushOrganizationMetadataToBroker()
    }

    private fun buildUserData(registrationRequest: RegistrationRequestDto): CreateUserData {
        return CreateUserData().apply {
            email = registrationRequest.userEmail
            firstName = registrationRequest.userFirstName
            lastName = registrationRequest.userLastName
            jobTitle = registrationRequest.userJobTitle
            phone = registrationRequest.userPhone
        }
    }

    private fun buildOrganizationData(registrationRequest: RegistrationRequestDto): CreateOrganizationData {
        return CreateOrganizationData().apply {
            name = registrationRequest.organizationName
            url = registrationRequest.organizationUrl
            businessUnit = registrationRequest.organizationBusinessUnit
            address = registrationRequest.organizationAddress
            billingAddress = registrationRequest.organizationBillingAddress
            description = registrationRequest.organizationDescription
            legalIdType = registrationRequest.organizationLegalIdType.toDb()
            legalIdNumber = registrationRequest.organizationLegalIdNumber
            commerceRegisterLocation = registrationRequest.organizationCommerceRegisterLocation
            mainContactName = registrationRequest.organizationMainContactName
            mainContactEmail = registrationRequest.organizationMainContactEmail
            mainContactPhone = registrationRequest.organizationMainContactPhone
            techContactName = registrationRequest.organizationTechContactName
            techContactEmail = registrationRequest.organizationTechContactEmail
            techContactPhone = registrationRequest.organizationTechContactPhone
        }
    }
}
