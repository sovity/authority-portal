package de.sovity.authorityportal.api.model.organization;

import de.sovity.authorityportal.api.model.MemberInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Organization information.")
public class OrganizationDetailsDto {

    @Schema(description = "MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mdsId;
    @Schema(description = "Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;
    @Schema(description = "Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    private String businessUnit;
    @Schema(description = "Main Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainAddress;
    @Schema(description = "Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String billingAddress;
    @Schema(description = "Legal ID type", requiredMode = Schema.RequiredMode.REQUIRED)
    private OrganizationLegalIdTypeDto legalIdType;
    @Schema(description = "Legal ID number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String legalId;
    @Schema(description = "Commerce register location (if applicable)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String commerceRegisterLocation;
    @Schema(description = "URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;
    @Schema(description = "Description of what the company does/is", requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;
    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    private OrganizationRegistrationStatusDto registrationStatus;
    @Schema(description = "Member count", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer memberCount;
    @Schema(description = "Connector count", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer connectorCount;
    @Schema(description = "Data offer count", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer dataOfferCount;
    @Schema(description = "Member information", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<MemberInfo> memberList;
    @Schema(description = "Admin User Id", requiredMode = Schema.RequiredMode.REQUIRED)
    private String adminUserId;
    @Schema(description = "Admin First Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String adminFirstName;
    @Schema(description = "Admin Last Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String adminLastName;
    @Schema(description = "Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactName;
    @Schema(description = "Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactEmail;
    @Schema(description = "Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mainContactPhone;
    @Schema(description = "Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactName;
    @Schema(description = "Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactEmail;
    @Schema(description = "Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    private String techContactPhone;
    @Schema(description = "Creation date of organization or organization invite", requiredMode = Schema.RequiredMode.REQUIRED)
    private OffsetDateTime createdAt;
    @Schema(description = "Creator of organization or organization invite", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdBy;
}
