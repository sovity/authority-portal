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

package de.sovity.authorityportal.web.thirdparty.daps.ext

import jakarta.ws.rs.client.WebTarget
import org.keycloak.admin.client.Keycloak

inline fun <reified T> Keycloak.instantiateResource(): T {
    val target = Keycloak::class.java.getDeclaredField("target").let {
        it.isAccessible = true
        it.get(this) as WebTarget
    }

    return Keycloak.getClientProvider().targetProxy(
        target,
        T::class.java
    )
}
