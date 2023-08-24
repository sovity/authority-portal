package de.sovity.authorityportal.web.services.auth

class UserViewRequiredRoles(roleName: String) {
    val self = "${roleName}_SELF"
    val organization = "${roleName}_ORGANIZATION"
    val global = "${roleName}_GLOBAL"
}
