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
package de.sovity.authorityportal.api

import io.swagger.v3.oas.annotations.ExternalDocumentation
import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Contact
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.info.License

@OpenAPIDefinition(
    info = Info(
        title = "Authority Portal API",
        version = "0.0.0",
        description = "REST API for sovity's Dataspace Authority Portal.",
        contact = Contact(
            name = "sovity GmbH",
            email = "contact@sovity.de",
            url = "https://github.com/sovity/ authority-portal/issues/new/choose"
        ),
        license = License(name = "UNLICENSED", url = "https://github.com/sovity/ authority-portal/blob/main/LICENSE")
    ),
    externalDocs = ExternalDocumentation(
        description = "Authority Portal API definitions.",
        url = "https://github.com/sovity/ authority-portal/tree/main/authority-portal-api"
    )
)
interface ApiInformation
