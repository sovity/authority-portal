package de.sovity.authorityportal.api.model.organization;

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
    String mdsId;

    @Schema(description = "Legal Name", requiredMode = Schema.RequiredMode.REQUIRED)
    String name;

    @Schema(description = "Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    String mainContactEmail;

    @Schema(description = "Number of Users", requiredMode = Schema.RequiredMode.REQUIRED)
    Integer numberOfUsers;

    @Schema(description = "Number of Connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    Integer numberOfConnectors;

    @Schema(description = "Number of Data Offers", requiredMode = Schema.RequiredMode.REQUIRED)
    Integer numberOfDataOffers;

    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    OrganizationRegistrationStatusDto registrationStatus;
}
