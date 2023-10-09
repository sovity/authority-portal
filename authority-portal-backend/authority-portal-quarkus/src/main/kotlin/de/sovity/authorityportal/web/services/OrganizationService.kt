package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class OrganizationService {

    @Inject
    lateinit var dsl: DSLContext

    fun getOrganizationOrThrow(mdsId: String): OrganizationRecord {
        return getOrganization(mdsId) ?: error("Organization with id $mdsId not found")
    }

    private fun getOrganization(mdsId: String): OrganizationRecord? {
        val o = Tables.ORGANIZATION

        return dsl.selectFrom(o)
            .where(o.MDS_ID.eq(mdsId))
            .fetchOne()
    }

    fun getOrganizations(): List<OrganizationRecord> {
        val o = Tables.ORGANIZATION

        return dsl.selectFrom(o)
            .fetch()
    }

    fun createOrganization(
        userId: String,
        mdsId: String,
        organization: CreateOrganizationRequest,
        registrationStatus: OrganizationRegistrationStatus
    ) {
        dsl.newRecord(Tables.ORGANIZATION).also {
            it.mdsId = mdsId
            it.name = organization.name
            it.address = organization.address
            it.duns = organization.duns
            it.url = organization.url
            it.securityEmail = organization.securityEmail
            it.createdBy = userId
            it.registrationStatus = registrationStatus
            it.createdAt = OffsetDateTime.now()

            it.insert()
        }
    }
}
