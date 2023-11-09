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
@Schema(description = "Information for registering a new user and organization.")
public class RegistrationRequestDto {

    @Schema(description = "User's Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userEmail;
    @Schema(description = "User's First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userFirstName;
    @Schema(description = "User's Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userLastName;
    @Schema(description = "User's Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userJobTitle;
    @Schema(description = "User's Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userPhone;
    @Schema(description = "Organization's Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationName;
    @Schema(description = "Organization's URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationUrl;
    @Schema(description = "Organization's Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationBusinessUnit;
    @Schema(description = "Organization's Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationAddress;
    @Schema(description = "Organization's Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationBillingAddress;
    @Schema(description = "Organization's Tax ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationTaxId;
    @Schema(description = "Organization's Commerce Register Number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationCommerceRegisterNumber;
    @Schema(description = "Organization's Commerce Register Location", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationCommerceRegisterLocation;
    @Schema(description = "Organization's Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationMainContactName;
    @Schema(description = "Organization's Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationMainContactEmail;
    @Schema(description = "Organization's Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationMainContactPhone;
    @Schema(description = "Organization's Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationTechContactName;
    @Schema(description = "Organization's Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationTechContactEmail;
    @Schema(description = "Organization's Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationTechContactPhone;

}
