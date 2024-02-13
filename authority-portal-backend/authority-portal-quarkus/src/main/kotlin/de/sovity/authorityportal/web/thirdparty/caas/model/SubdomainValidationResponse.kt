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
