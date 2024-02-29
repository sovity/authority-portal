package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
@Schema(description = "Information about the Organization.")
public class UpdateOrganizationDto {

    @NotBlank(message = "Organization's URL of the organization website cannot be blank")
    @Schema(description = "Organization's URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;

    @Schema(description = "Organization description", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;

    @Schema(description = "Organization's Business unit", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String businessUnit;

    @Schema(description = "Organization's Industry", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String industry;

    @NotBlank(message = "Organization's Address cannot be blank")
    @Schema(description = "Organization's Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String address;

    @NotBlank(message = "Organization's Billing Address cannot be blank")
    @Schema(description = "Organization's Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String billingAddress;

    @NotBlank(message = "Organization's Main Contact Name cannot be blank")
    @Schema(description = "Organization's Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactName;

    @NotBlank(message = "Organization's Main Contact Email cannot be blank")
    @Schema(description = "Organization's Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactEmail;

    @NotBlank(message = "Organization's Main Contact Phone cannot be blank")
    @Schema(description = "Organization's Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactPhone;

    @NotBlank(message = "Organization's Tech Contact Name cannot be blank")
    @Schema(description = "Organization's Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactName;

    @NotBlank(message = "Organization's Tech Contact Email cannot be blank")
    @Schema(description = "Organization's Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactEmail;

    @NotBlank(message = "Organization's Tech Contact Phone cannot be blank")
    @Schema(description = "Organization's Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactPhone;
}
