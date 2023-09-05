package de.sovity.authorityportal.web.services.db

import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class OrganizationService {

    @Inject
    lateinit var dsl: DSLContext

    fun createOrganization(userId: String, mdsId: String, organization: CreateOrganizationRequest) {
        dsl.newRecord(Tables.ORGANIZATION).also {
            it.mdsId = mdsId
            it.name = organization.name
            it.address = organization.address
            it.duns = organization.duns
            it.url = organization.url
            it.securityEmail = organization.securityEmail
            it.createdBy = userId

            it.insert()
        }
    }

    fun getOrganization(mdsId: String): OrganizationRecord? {
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
}
