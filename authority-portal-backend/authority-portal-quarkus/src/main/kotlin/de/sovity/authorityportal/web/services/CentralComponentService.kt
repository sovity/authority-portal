package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.CentralComponentCreateRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.records.ComponentRecord
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class CentralComponentService {

    @Inject
    lateinit var dsl: DSLContext

    fun getCentralComponentOrThrow(centralComponentId: String): ComponentRecord {
        return getComponent(centralComponentId) ?: error("Component with id $centralComponentId not found")
    }

    fun getCentralComponents(envId: String): List<ComponentRecord> {
        val c = Tables.COMPONENT

        return dsl.selectFrom(c)
            .where(c.ENVIRONMENT.eq(envId))
            .fetch()
    }

    private fun getComponent(centralComponentId: String): ComponentRecord? {
        val c = Tables.COMPONENT

        return dsl.selectFrom(c)
            .where(c.ID.eq(centralComponentId))
            .fetchOne()
    }

    fun createCentralComponent(
        centralComponentId: String,
        mdsId: String,
        environment: String,
        clientId: String,
        centralComponentCreateRequest: CentralComponentCreateRequest,
        createdBy: String
    ) {
        dsl.newRecord(Tables.COMPONENT).also {
            it.id = centralComponentId
            it.mdsId = mdsId
            it.environment = environment
            it.clientId = clientId
            it.name = centralComponentCreateRequest.name
            it.homepageUrl = centralComponentCreateRequest.homepageUrl
            it.endpointUrl = centralComponentCreateRequest.endpointUrl
            it.createdBy = createdBy
            it.createdAt = OffsetDateTime.now()

            it.insert()
        }
    }

    fun deleteCentralComponent(centralComponentId: String) {
        val c = Tables.COMPONENT

        dsl.deleteFrom(c)
            .where(c.ID.eq(centralComponentId))
            .execute()
    }
}
