package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information of a central dataspace component.")
public class CentralComponentDto {
    @Schema(description = "Central Component ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String centralComponentId;

    @Schema(description = "Component Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "Home Page URL")
    private String homepageUrl;

    @Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String endpointUrl;

    @Schema(description = "Created By Full Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdByUserFullName;

    @Schema(description = "Created By Organization Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdByOrgName;

    @Schema(description = "Created By Organization MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdByOrgMdsId;
}
