package de.sovity.authorityportal.web.services.thirdparty.daps.ext

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
