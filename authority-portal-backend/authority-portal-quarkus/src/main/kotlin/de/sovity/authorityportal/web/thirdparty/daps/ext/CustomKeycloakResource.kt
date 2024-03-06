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

import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.jboss.resteasy.reactive.RestForm
import org.keycloak.representations.idm.CertificateRepresentation

interface CustomKeycloakResource {

        @POST
        @Path("/admin/realms/{realm}/clients/{clientId}/certificates/{attr}/upload-certificate")
        @Consumes(MediaType.MULTIPART_FORM_DATA)
        @Produces(MediaType.APPLICATION_JSON)
        fun uploadJksCertificate(
                @PathParam("realm") realm: String,
                @PathParam("clientId") clientId: String,
                @PathParam("attr") attributePrefix: String,
                @RestForm file: ByteArray,
                @RestForm keystoreFormat: String
        ): CertificateRepresentation?
}
