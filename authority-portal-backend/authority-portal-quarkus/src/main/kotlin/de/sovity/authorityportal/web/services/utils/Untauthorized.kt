package de.sovity.authorityportal.web.services.utils

import jakarta.ws.rs.NotAuthorizedException
import jakarta.ws.rs.core.Response

/**
 * Throws an exception that indicates that the user is not authorized to access the requested resource.
 */
fun unauthorized(): Nothing {
    throw NotAuthorizedException(
        "Access denied",
        Response.status(Response.Status.UNAUTHORIZED)
            .header("WWW-Authenticate", "Bearer realm=\"authority-portal\"")
            .build()
    )
}
