package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.OffsetDateTime

@ApplicationScoped
class UserService {

    @Inject
    lateinit var dsl: DSLContext

    fun getUserOrThrow(userId: String): UserRecord {
        return getUser(userId) ?: error("User with id $userId not found")
    }

    fun getUserOrCreate(userId: String): UserRecord {
        return getUser(userId) ?: createUser(userId, UserRegistrationStatus.CREATED)
    }

    fun getUsersByMdsId(mdsId: String): List<UserRecord> {
        val u = Tables.USER

        return dsl.selectFrom(u)
            .where(u.ORGANIZATION_MDS_ID.eq(mdsId))
            .fetch()
            .toList()
    }

    fun getUsers(): List<UserRecord> {
        val u = Tables.USER

        return dsl.selectFrom(u)
            .toList()
    }

    fun getUserCountsByMdsIds(): Map<String, Int> {
        val u = Tables.USER

        return dsl.select(u.ORGANIZATION_MDS_ID, DSL.count())
            .from(u)
            .groupBy(u.ORGANIZATION_MDS_ID)
            .fetchMap(u.ORGANIZATION_MDS_ID, DSL.count())
    }

    private fun getUser(userId: String): UserRecord? {
        val u = Tables.USER

        return dsl.selectFrom(u)
            .where(u.ID.eq(userId))
            .fetchOne()
    }

    fun getOrCreateUserFromKeycloak(keycloakUser: KeycloakUserDto): UserRecord {
        return getUser(keycloakUser.userId)
            ?: createUser(keycloakUser.userId, UserRegistrationStatus.CREATED).also {
                it.email = keycloakUser.email
                it.update()
            }
    }

    fun createUser(userId: String, registrationStatus: UserRegistrationStatus, mdsId: String? = null): UserRecord {
        return dsl.newRecord(Tables.USER).also {
            it.id = userId
            it.organizationMdsId = mdsId
            it.registrationStatus = registrationStatus
            it.createdAt = OffsetDateTime.now()

            it.insert()
        }
    }

    fun registerUserWithDetails(
        userId: String,
        registrationStatus: UserRegistrationStatus,
        email: String,
        firstName: String,
        lastName: String,
        jobTitle: String? = null,
        phone: String? = null,
        mdsId: String? = null
    ): UserRecord {
        return createUser(userId, registrationStatus, mdsId).also {
            it.email = email
            it.firstName = firstName
            it.lastName = lastName
            it.jobTitle = jobTitle
            it.phone = phone

            it.update()
        }
    }
}
