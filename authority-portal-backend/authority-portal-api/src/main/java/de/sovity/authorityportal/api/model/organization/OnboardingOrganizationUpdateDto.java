package de.sovity.authorityportal.api.model.organization;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information about the organization provided while onboarding.")
public class OnboardingOrganizationUpdateDto {

    @NotBlank(message = "Name cannot be blank.")
    @Schema(description = "Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "Organization description", requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

    @NotBlank(message = "Website cannot be blank.")
    @Schema(description = "Website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;

    @Schema(description = "Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    private String businessUnit;

    @Schema(description = "Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    private String industry;

    @NotBlank(message = "Address cannot be blank.")
    @Schema(description = "Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String address;

    @NotBlank(message = "Billing address cannot be blank.")
    @Schema(description = "Billing address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String billingAddress;

    @NotNull(message = "Legal identification type cannot be null")
    @Schema(description = "Legal identification type", requiredMode = Schema.RequiredMode.REQUIRED)
    private OrganizationLegalIdTypeDto legalIdType;

    @NotBlank(message = "Legal identification number cannot be blank")
    @Schema(description = "Legal identification number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String legalIdNumber;

    @Schema(description = "Commerce register location", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String commerceRegisterLocation;

    @NotBlank(message = "Main contact name cannot be blank")
    @Schema(description = "Main contact name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactName;

    @NotBlank(message = "Main contact email cannot be blank")
    @Schema(description = "Main contact email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactEmail;

    @NotBlank(message = "Main contact phone cannot be blank")
    @Schema(description = "Main contact phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactPhone;

    @NotBlank(message = "Technical contact name cannot be blank")
    @Schema(description = "Technical contact name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactName;

    @NotBlank(message = "Technical contact email cannot be blank")
    @Schema(description = "Technical contact email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactEmail;

    @NotBlank(message = "Technical contact phone cannot be blank")
    @Schema(description = "Technical contact phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactPhone;
}
