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
package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema
import lombok.AllArgsConstructor
import lombok.Data
import lombok.NoArgsConstructor

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response wrapper for the subdomain validation response")
class SubdomainValidationResponse {
    @Schema(description = "Validation result", requiredMode = Schema.RequiredMode.REQUIRED)
    var valid: Boolean = false
    @Schema(description = "Error messages, should valid be false", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    var errorMessages: List<String> = emptyList()
}
