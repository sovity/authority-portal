package de.sovity.authorityportal.web.thirdparty.keycloak

import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import de.sovity.authorityportal.web.services.FirstUserService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import io.quarkus.logging.Log
import io.quarkus.runtime.Startup
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty

@ApplicationScoped
class KeycloakUsersDBMigrationService(
    @ConfigProperty(name = "authority-portal.sync-users")
    val syncUsers: Boolean
) {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var firstUserService: FirstUserService

    @Startup
    fun startupSync() {
        if (syncUsers) {
            syncUsersFromKeycloak()
        }
    }

    @Scheduled(every="5m")
    fun scheduledSync() {
        if (syncUsers) {
            syncUsersToKeycloak()
        }
    }

    @Transactional
    fun syncUsersToKeycloak() {
        val users = userService.getUsers()
        users.forEach(this::syncUserDetailsToKeycloak)
        Log.info("Synced ${users.size} users from DB to Keycloak")
    }

    @Transactional
    fun syncUsersFromKeycloak() {
        val keycloakUsers = keycloakService.getUsers()
        keycloakUsers.forEach(this::syncUserDetailsFromKeycloak)
        Log.info("Synced ${keycloakUsers.size} users from Keycloak to DB")
    }

    private fun syncUserDetailsToKeycloak(user: UserRecord) {
        try {
            keycloakService.updateUser(user.id, user.firstName, user.lastName)
        } catch (e: Exception) {
            Log.error("User with id ${user.id}, e-mail: ${user.email}; has failed to sync to Keycloak.", e)
        }
    }

    private fun syncUserDetailsFromKeycloak(keycloakUser: KeycloakUserDto) {
        try {
            val user = userService.getOrCreateUserFromKeycloak(keycloakUser)
            firstUserService.setupFirstUserIfRequired(user.id)
        } catch (e: Exception) {
            Log.error("User with id ${keycloakUser.userId}, e-mail: ${keycloakUser.email}; has failed to sync from Keycloak.", e)
        }
    }
}
