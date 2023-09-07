package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Visible organization in organization overview page.")
public class OrganizationOverviewEntryDto {
    @Schema(description = "MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mdsId;
    @Schema(description = "Legal Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;
    @Schema(description = "URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;
    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    private OrganizationRegistrationStatusDto registrationStatus;
}
