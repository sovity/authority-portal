package de.sovity.authorityportal.seeds.utils

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorContractOffersExceeded
import de.sovity.authorityportal.db.jooq.enums.ConnectorDataOffersExceeded
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.db.jooq.enums.OrganizationLegalIdType
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.ComponentRecord
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import org.jooq.DSLContext
import java.time.OffsetDateTime


/**
 * Helper class for building Test Data for both Integration Tests and Local E2E Development
 */
class ScenarioData {

    // lists of objects for each table to be inserted
    val users = mutableListOf<UserRecord>()
    val organizations = mutableListOf<OrganizationRecord>()
    val connectors = mutableListOf<ConnectorRecord>()
    val components = mutableListOf<ComponentRecord>()

    fun install(dsl: DSLContext) {
        dsl.batchInsert(users)
        dsl.batchInsert(organizations)
        dsl.batchInsert(connectors)
        dsl.batchInsert(components)

        // add organization creators to their organizations (need to do it this way because of db constraints)
        dsl.update(Tables.USER)
            .set(Tables.USER.ORGANIZATION_MDS_ID, Tables.ORGANIZATION.MDS_ID)
            .from(Tables.USER
                .innerJoin(Tables.ORGANIZATION).on(Tables.USER.ID.eq(Tables.ORGANIZATION.CREATED_BY))
                .where(Tables.USER.ORGANIZATION_MDS_ID.isNull))
            .execute()
    }

    fun user(
      id: Int,
      organizationMdsId: Int?,
      registrationStatus: UserRegistrationStatus,
      email: String,
      firstName: String,
      lastName: String,
      jobTitle: String,
      phone: String,
      onboardingType: UserOnboardingType,
      invitedBy: String?
    ) {
        UserRecord().also {
            it.id = dummyDevUserUuid(id)
            it.organizationMdsId = organizationMdsId?.let { mdsId -> dummyDevMdsId(mdsId) }
            it.registrationStatus = registrationStatus
            it.email = email
            it.firstName = firstName
            it.lastName = lastName
            it.jobTitle = jobTitle
            it.phone = phone
            it.onboardingType = onboardingType
            it.invitedBy = invitedBy
            it.createdAt = OffsetDateTime.now()
            users.add(it)
        }
    }

    fun organization(
        mdsId: Int,
        name: String,
        address: String,
        url: String,
        createdBy: String,
        registrationStatus: OrganizationRegistrationStatus,
        businessUnit: String,
        billingAddress: String,
        taxId: String?,
        commerceRegisterNumber: String?,
        commerceRegisterLocation: String?,
        mainContactName: String,
        mainContactEmail: String,
        mainContactPhone: String,
        technicalContactName: String,
        technicalContactEmail: String,
        technicalContactPhone: String,
        legalIdType: OrganizationLegalIdType,
        description: String,
        industry: String
    ) {
        OrganizationRecord().also {
            it.mdsId = dummyDevMdsId(mdsId)
            it.name = name
            it.address = address
            it.url = url
            it.createdBy = createdBy
            it.registrationStatus = registrationStatus
            it.businessUnit = businessUnit
            it.billingAddress = billingAddress
            it.taxId = taxId
            it.commerceRegisterNumber = commerceRegisterNumber
            it.commerceRegisterLocation = commerceRegisterLocation
            it.mainContactName = mainContactName
            it.mainContactEmail = mainContactEmail
            it.mainContactPhone = mainContactPhone
            it.techContactName = technicalContactName
            it.techContactEmail = technicalContactEmail
            it.techContactPhone = technicalContactPhone
            it.legalIdType = legalIdType
            it.description = description
            it.industry = industry
            it.createdAt = OffsetDateTime.now()
            organizations.add(it)
        }
    }

    fun connector(
        connectorId: String, // just the second half of the ID
        mdsId: String,
        providerMdsId: String,
        type: ConnectorType,
        environment: String,
        clientId: String,
        name: String,
        location: String,
        frontendUrl: String?,
        createdBy: String,
        brokerRegistrationStatus: ConnectorBrokerRegistrationStatus,
        managementUrl: String,
        endpointUrl: String,
        jwksUrl: String?,
        caasStatus: CaasStatus?,
        lastRefreshAttempt: OffsetDateTime?,
        lastRefreshSuccess: OffsetDateTime?,
        onlineStatus: ConnectorOnlineStatus,
        dataOffersExceeded: ConnectorDataOffersExceeded,
        contractOffersExceeded: ConnectorContractOffersExceeded
    ) {
        ConnectorRecord().also {
            it.connectorId = "$mdsId.$connectorId"
            it.mdsId = mdsId
            it.providerMdsId = providerMdsId
            it.type = type
            it.environment = environment
            it.clientId = clientId
            it.name = name
            it.location = location
            it.frontendUrl = frontendUrl
            it.createdBy = createdBy
            it.brokerRegistrationStatus = brokerRegistrationStatus
            it.managementUrl = managementUrl
            it.endpointUrl = endpointUrl
            it.jwksUrl = jwksUrl
            it.caasStatus = caasStatus
            it.lastRefreshAttemptAt = lastRefreshAttempt
            it.lastSuccessfulRefreshAt = lastRefreshSuccess
            it.onlineStatus = onlineStatus
            it.dataOffersExceeded = dataOffersExceeded
            it.contractOffersExceeded = contractOffersExceeded
            connectors.add(it)
        }
    }

    fun component(
        componentId: String, // just the second half
        mdsId: String,
        name: String,
        homepageUrl: String?,
        endpointUrl: String,
        environment: String,
        clientId: String,
        createdBy: String
    ) {
        ComponentRecord().also {
            it.id = "$mdsId.$componentId"
            it.mdsId = mdsId
            it.name = name
            it.homepageUrl = homepageUrl
            it.endpointUrl = endpointUrl
            it.environment = environment
            it.clientId = clientId
            it.createdBy = createdBy
            components.add(it)
        }
    }
}
