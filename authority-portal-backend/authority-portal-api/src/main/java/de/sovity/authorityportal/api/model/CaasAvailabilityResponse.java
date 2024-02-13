package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response for the availability of free CaaS")
public class CaasAvailabilityResponse {
    @Schema(description = "CaaS limit for your organization")
    private Integer limit;

    @Schema(description = "CaaS usage for your organization")
    private Integer current;
}
