package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema
import lombok.AllArgsConstructor
import lombok.Data
import lombok.NoArgsConstructor

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response wrapper for CaaS API")
class CaasPortalResponse {
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    var value: CaasDetails? = null
}
