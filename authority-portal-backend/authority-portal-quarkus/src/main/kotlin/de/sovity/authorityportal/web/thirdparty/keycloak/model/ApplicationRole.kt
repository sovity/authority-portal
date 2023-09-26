package de.sovity.authorityportal.web.thirdparty.keycloak.model

import de.sovity.authorityportal.web.Roles

/**
 * Each user can have several roles in the application. These roles are mapped to Keycloak role groups.
 *
 * @param kcGroupName The name of the role group in Keycloak.
 * @param userRole The role of the user in the application.
 */
enum class ApplicationRole(val kcGroupName: String, val userRole: String) {
    OPERATOR_ADMIN("ROLE_OPERATOR_ADMIN", Roles.UserRoles.OPERATOR_ADMIN),
    SERVICE_PARTNER_ADMIN("ROLE_SERVICE_PARTNER_ADMIN", Roles.UserRoles.SERVICE_PARTNER_ADMIN),
    AUTHORITY_ADMIN("ROLE_AUTHORITY_ADMIN", Roles.UserRoles.AUTHORITY_ADMIN),
    AUTHORITY_USER("ROLE_AUTHORITY_USER", Roles.UserRoles.AUTHORITY_USER)
}
