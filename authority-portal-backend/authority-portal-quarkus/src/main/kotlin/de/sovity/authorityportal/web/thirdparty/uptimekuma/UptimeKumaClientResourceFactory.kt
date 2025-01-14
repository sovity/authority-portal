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

package de.sovity.authorityportal.web.thirdparty.uptimekuma

import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Produces
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.net.URI
import java.util.Optional

@ApplicationScoped
class UptimeKumaClientResourceFactory(
    @ConfigProperty(name = "authority-portal.kuma.metrics-url")
    val uptimeKumaUrl: Optional<String>
) {

    @Produces
    @ApplicationScoped
    fun uptimeKumaRestClient(): UptimeKumaClientResource? {
        if (uptimeKumaUrl.isEmpty) {
            return null
        }

        return QuarkusRestClientBuilder.newBuilder()
            .baseUri(URI.create(uptimeKumaUrl.get()))
            .build(UptimeKumaClientResource::class.java)!!
    }
}
