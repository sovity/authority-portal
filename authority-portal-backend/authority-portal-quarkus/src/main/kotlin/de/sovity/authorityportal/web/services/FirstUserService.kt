package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.ApplicationRole
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.util.concurrent.atomic.AtomicBoolean

@ApplicationScoped
class FirstUserService {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var keycloakService: KeycloakService

    val isFirstUserHandled = AtomicBoolean(false)

    fun setupFirstUserIfRequired(userId: String) {
        if (isFirstUserHandled.compareAndSet(false, true) && isFirstUser(userId)) {
            setupFirstUser(userId)
        }
    }

    private fun setupFirstUser(userId: String) {
        keycloakService.joinApplicationRole(userId, ApplicationRole.AUTHORITY_ADMIN)
        updateStatus(userId, UserRegistrationStatus.FIRST_USER)
    }

    private fun isFirstUser(userId: String): Boolean {
        val u = Tables.USER

        val count = dsl.fetchCount(dsl.selectFrom(u))
        if (count != 1) {
            return false
        }

        return dsl.fetchExists(dsl.selectFrom(u).where(u.ID.eq(userId)))
    }

    private fun updateStatus(userId: String, status: UserRegistrationStatus) {
        val u = Tables.USER

        dsl.update(u)
            .set(u.REGISTRATION_STATUS, status)
            .where(u.ID.eq(userId))
            .execute()
    }
}
