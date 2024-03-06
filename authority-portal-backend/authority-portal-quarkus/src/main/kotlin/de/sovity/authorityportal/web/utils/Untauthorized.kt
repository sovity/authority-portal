/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

package de.sovity.authorityportal.web.utils

import jakarta.ws.rs.NotAuthorizedException
import jakarta.ws.rs.core.Response

/**
 * Throws an exception that indicates that the user is not authorized to access the requested resource.
 */
fun unauthorized(message: String = ""): Nothing {
    throw NotAuthorizedException(
        "Access denied. $message",
        Response.status(Response.Status.UNAUTHORIZED)
            .header("WWW-Authenticate", "Bearer realm=\"authority-portal\"")
            .build()
    )
}
