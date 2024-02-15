package de.sovity.authorityportal.api.model;

import de.sovity.authorityportal.api.model.organization.OrganizationLegalIdTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information for registering a new user and organization.")
public class RegistrationRequestDto {

    @NotBlank(message = "User's Email cannot be blank")
    @Schema(description = "User's Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userEmail;

    @NotBlank(message = "User's First name cannot be blank")
    @Schema(description = "User's First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userFirstName;

    @NotBlank(message = "User's Last name cannot be blank")
    @Schema(description = "User's Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userLastName;

    @NotBlank(message = "User's Job title cannot be blank")
    @Schema(description = "User's Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userJobTitle;

    @NotBlank(message = "User's Phone number cannot be blank")
    @Schema(description = "User's Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userPhone;

    @NotBlank(message = "User's Password cannot be blank")
    @Schema(description = "User's Password", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userPassword;

    @NotBlank(message = "Organization's Legal name cannot be blank")
    @Schema(description = "Organization's Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationName;

    @NotBlank(message = "Organization's URL of the organization website cannot be blank")
    @Schema(description = "Organization's URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationUrl;

    @NotBlank(message = "Organization's Business unit cannot be blank")
    @Schema(description = "Organization's Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationBusinessUnit;

    @NotBlank(message = "Organization's Address cannot be blank")
    @Schema(description = "Organization's Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationAddress;

    @NotBlank(message = "Organization's Billing Address cannot be blank")
    @Schema(description = "Organization's Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationBillingAddress;

    @Schema(description = "Organization description", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String organizationDescription;

    @NotNull(message = "Organization's ID type cannot be null")
    @Schema(description = "Organization's legal ID type", requiredMode = Schema.RequiredMode.REQUIRED)
    private OrganizationLegalIdTypeDto organizationLegalIdType;

    @NotBlank(message = "Organization's legal ID number cannot be blank")
    @Schema(description = "Organization's legal ID number - either Tax ID or Commerce register number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationLegalIdNumber;

    @Schema(description = "Organization's Commerce Register Location", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String organizationCommerceRegisterLocation;

    @NotBlank(message = "Organization's Main Contact Name cannot be blank")
    @Schema(description = "Organization's Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationMainContactName;

    @NotBlank(message = "Organization's Main Contact Email cannot be blank")
    @Schema(description = "Organization's Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationMainContactEmail;

    @NotBlank(message = "Organization's Main Contact Phone cannot be blank")
    @Schema(description = "Organization's Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationMainContactPhone;

    @NotBlank(message = "Organization's Tech Contact Name cannot be blank")
    @Schema(description = "Organization's Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationTechContactName;

    @NotBlank(message = "Organization's Tech Contact Email cannot be blank")
    @Schema(description = "Organization's Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationTechContactEmail;

    @NotBlank(message = "Organization's Tech Contact Phone cannot be blank")
    @Schema(description = "Organization's Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationTechContactPhone;

}
