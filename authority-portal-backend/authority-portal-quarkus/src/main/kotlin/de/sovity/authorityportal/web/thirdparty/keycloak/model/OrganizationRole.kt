package de.sovity.authorityportal.web.thirdparty.keycloak.model

import de.sovity.authorityportal.web.Roles

/**
 * Each organization gets a user group in Keycloak. Each organization user group has several subgroups
 * with the following names, giving their users the following user role.
 *
 * @param kcSubGroupName The name of the subgroup in Keycloak.
 * @param userRole The role of the user in the organization.
 */
enum class OrganizationRole(val kcSubGroupName: String, val userRole: String) {
    PARTICIPANT_ADMIN("Participant Admin", Roles.UserRoles.PARTICIPANT_ADMIN),
    PARTICIPANT_CURATOR("Participant Curator", Roles.UserRoles.PARTICIPANT_CURATOR),
    PARTICIPANT_USER("Participant User", Roles.UserRoles.PARTICIPANT_USER)
}
