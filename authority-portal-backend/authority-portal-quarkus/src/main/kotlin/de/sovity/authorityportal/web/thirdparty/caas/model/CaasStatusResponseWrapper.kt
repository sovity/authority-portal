package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema
import lombok.AllArgsConstructor
import lombok.Data
import lombok.NoArgsConstructor

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response wrapper for CaaS Status API")
class CaasStatusResponseWrapper {
    @Schema(description = "Response value", requiredMode = Schema.RequiredMode.REQUIRED)
    var value: List<CaasStatusResponse> = emptyList()
}
