package de.sovity.authorityportal.seeds.utils

import com.fasterxml.jackson.databind.ObjectMapper
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
import de.sovity.authorityportal.db.jooq.tables.records.ContractOfferRecord
import de.sovity.authorityportal.db.jooq.tables.records.DataOfferRecord
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import de.sovity.edc.ext.wrapper.api.common.model.UiAsset
import de.sovity.edc.ext.wrapper.api.common.model.UiPolicy
import org.flywaydb.core.internal.util.JsonUtils
import org.jooq.DSLContext
import org.jooq.JSONB
import java.time.OffsetDateTime


/**
 * Helper class for building Test Data for both Integration Tests and Local E2E Development
 */
class ScenarioData {

    // lists of objects for each table to be inserted
    private val users = mutableListOf<UserRecord>()
    private val organizations = mutableListOf<OrganizationRecord>()
    private val connectors = mutableListOf<ConnectorRecord>()
    private val components = mutableListOf<ComponentRecord>()
    private val dataOffers = mutableListOf<DataOfferRecord>()
    private val contractOffers = mutableListOf<ContractOfferRecord>()

    fun install(dsl: DSLContext) {
        val userOrgMap = users.associate { it.id to it.organizationMdsId }
        users.forEach {
            it.organizationMdsId = null
        }

        dsl.batchInsert(users).execute()
        dsl.batchInsert(organizations).execute()

        users.forEach {
            it.organizationMdsId = userOrgMap[it.id]
        }
        dsl.batchUpdate(users).execute()

        dsl.batchInsert(connectors).execute()
        dsl.batchInsert(components).execute()
        dsl.batchInsert(dataOffers).execute()
        dsl.batchInsert(contractOffers).execute()
    }

    fun user(userId: Int, orgId: Int?, applyer: (UserRecord) -> Unit = {}) {
        UserRecord().also {
            it.id = dummyDevUserUuid(userId)
            it.organizationMdsId = orgId?.let { id -> dummyDevMdsId(id) }
            it.registrationStatus = UserRegistrationStatus.ACTIVE
            it.email = "user$userId@org$orgId.null"
            it.firstName = "Firstname"
            it.lastName = "Lastname"
            it.jobTitle = "Job Title"
            it.phone = "+0 000 000 000"
            it.onboardingType = UserOnboardingType.SELF_REGISTRATION
            it.invitedBy = null
            it.createdAt = dummyDate(0)
            applyer(it)
            users.add(it)
        }
    }

    fun organization(orgId: Int, createdByUserId: Int, applyer: (OrganizationRecord) -> Unit = {}) {
        OrganizationRecord().also {
            it.mdsId = dummyDevMdsId(orgId)
            it.name = "Organization $orgId"
            it.address = "Address"
            it.url = "https://url"
            it.createdBy = dummyDevUserUuid(createdByUserId)
            it.registrationStatus = OrganizationRegistrationStatus.ACTIVE
            it.businessUnit = "BU"
            it.billingAddress = "Billing Address"
            it.taxId = "Tax ID"
            it.commerceRegisterNumber = null
            it.commerceRegisterLocation = null
            it.mainContactName = "Main Contact Name"
            it.mainContactEmail = "main@contact"
            it.mainContactPhone = "+0 000 000 000"
            it.techContactName = "Tech Contact Name"
            it.techContactEmail = "tech@contact"
            it.techContactPhone = "+0 000 000 000"
            it.legalIdType = OrganizationLegalIdType.TAX_ID
            it.description = "Description"
            it.industry = "Industry"
            it.createdAt = dummyDate(0)
            applyer(it)
            organizations.add(it)
        }
    }

    fun connector(connectorId: Int, orgId: Int, createdByUserId: Int, applyer: (ConnectorRecord) -> Unit = {}) {
        val mdsId = dummyDevMdsId(orgId)
        val fullConnectorId = "${dummyDevMdsId(orgId)}.${dummyDevConnectorId(connectorId)}"
        ConnectorRecord().also {
            it.connectorId = fullConnectorId
            it.mdsId = mdsId
            it.providerMdsId = mdsId
            it.type = ConnectorType.OWN
            it.environment = "test"
            it.clientId = "clientId"
            it.name = "Connector"
            it.location = "Location"
            it.frontendUrl = "https://connector"
            it.createdBy = dummyDevUserUuid(createdByUserId)
            it.brokerRegistrationStatus = ConnectorBrokerRegistrationStatus.REGISTERED
            it.managementUrl = "https://connector/management"
            it.endpointUrl = "https://connector/dsp"
            it.jwksUrl = "https://jwks"
            it.caasStatus = null
            it.lastRefreshAttemptAt = dummyDate(0)
            it.lastSuccessfulRefreshAt = dummyDate(0)
            it.onlineStatus = ConnectorOnlineStatus.ONLINE
            it.dataOffersExceeded = ConnectorDataOffersExceeded.UNKNOWN
            it.contractOffersExceeded = ConnectorContractOffersExceeded.UNKNOWN
            it.createdAt = OffsetDateTime.now()
            applyer(it)
            connectors.add(it)
        }
    }

    fun component(componentId: Int, orgId: Int, createdByUserId: Int, applyer: (ComponentRecord) -> Unit = {}) {
        val fullComponentId = "${dummyDevMdsId(orgId)}.${dummyDevConnectorId(componentId)}"
        val mdsId = dummyDevMdsId(orgId)
        ComponentRecord().also {
            it.id = fullComponentId
            it.mdsId = mdsId
            it.name = "Component name"
            it.homepageUrl = "https://component"
            it.endpointUrl = "https://component/dsp"
            it.environment = "test"
            it.clientId = "clientId"
            it.createdBy = dummyDevUserUuid(createdByUserId)
            it.createdAt = OffsetDateTime.now()
            applyer(it)
            components.add(it)
        }
    }

    fun dataOffer(connectorId: Int, orgId: Int, assetId: Int, applyer: (DataOfferRecord) -> Unit = {}) {
        val fullConnectorId = "${dummyDevMdsId(orgId)}.${dummyDevConnectorId(connectorId)}"
        val objectMapper = ObjectMapper()

        val uiAsset = UiAsset().also {
            it.title = "Title"
            it.description = "Description"
        }

        DataOfferRecord().also {
            it.connectorId = fullConnectorId
            it.assetId = dummyDevAssetId(assetId)
            it.environment = "test"
            it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset))
            it.createdAt = OffsetDateTime.now()
            it.updatedAt = OffsetDateTime.now()
            it.assetTitle = uiAsset.title
            it.description = uiAsset.description
            it.curatorOrganizationName = "Curator Organization Name"
            it.dataCategory = "Data Category"
            it.dataSubcategory = "Data Subcategory"
            it.transportMode = "Transport Mode"
            it.geoReferenceMethod = "Geo Reference Method"
            it.keywords = emptyList()
            it.keywordsCommaJoined = ""
            applyer(it)
            dataOffers.add(it)
        }
    }

    fun contractOffer(connectorId: Int, orgId: Int, assetId: Int, contractOfferId: Int, applyer: (ContractOfferRecord) -> Unit = {}) {
        val fullConnectorId = "${dummyDevMdsId(orgId)}.${dummyDevConnectorId(connectorId)}"
        val objectMapper = ObjectMapper()

        val uiPolicy = UiPolicy().also {
            it.constraints = emptyList()
            it.errors = emptyList()
            it.policyJsonLd
        }

        ContractOfferRecord().also {
            it.connectorId = fullConnectorId
            it.contractOfferId = dummyDevContractOfferId(contractOfferId)
            it.assetId = dummyDevAssetId(assetId)
            it.environment = "test"
            it.uiPolicyJson = JSONB.valueOf(objectMapper.writeValueAsString(uiPolicy))
            it.createdAt = OffsetDateTime.now()
            it.updatedAt = OffsetDateTime.now()
            applyer(it)
            contractOffers.add(it)
        }
    }
}
