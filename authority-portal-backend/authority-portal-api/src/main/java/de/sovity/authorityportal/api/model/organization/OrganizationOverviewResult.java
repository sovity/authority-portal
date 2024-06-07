package de.sovity.authorityportal.api.model.organization;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "All data for organization overview page.")
public class OrganizationOverviewResult {
    @Schema(description = "Visible organizations.", requiredMode = Schema.RequiredMode.REQUIRED)
    List<OrganizationOverviewEntryDto> organizations;
}

