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
    String mdsId;
    @Schema(description = "Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    String name;
    @Schema(description = "Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    String businessUnit;
    @Schema(description = "Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    String industry;
    @Schema(description = "Main Address", requiredMode = Schema.RequiredMode.REQUIRED)
    String mainAddress;
    @Schema(description = "Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    String billingAddress;
    @Schema(description = "Legal ID type", requiredMode = Schema.RequiredMode.REQUIRED)
    OrganizationLegalIdTypeDto legalIdType;
    @Schema(description = "Legal ID number", requiredMode = Schema.RequiredMode.REQUIRED)
    String legalId;
    @Schema(description = "Commerce register location (if applicable)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    String commerceRegisterLocation;
    @Schema(description = "URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    String url;
    @Schema(description = "Description of what the company does/is", requiredMode = Schema.RequiredMode.REQUIRED)
    String description;
    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    OrganizationRegistrationStatusDto registrationStatus;
    @Schema(description = "Member count", requiredMode = Schema.RequiredMode.REQUIRED)
    Integer memberCount;
    @Schema(description = "Connector count", requiredMode = Schema.RequiredMode.REQUIRED)
    Integer connectorCount;
    @Schema(description = "Data offer count", requiredMode = Schema.RequiredMode.REQUIRED)
    Integer dataOfferCount;
    @Schema(description = "Member information", requiredMode = Schema.RequiredMode.REQUIRED)
    List<MemberInfo> memberList;
    @Schema(description = "Organization creator: User Id", requiredMode = Schema.RequiredMode.REQUIRED)
    String createdByUserId;
    @Schema(description = "Organization creator: First Name", requiredMode = Schema.RequiredMode.REQUIRED)
    String createdByFirstName;
    @Schema(description = "Organization creator: Last Name", requiredMode = Schema.RequiredMode.REQUIRED)
    String createdByLastName;
    @Schema(description = "Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    String mainContactName;
    @Schema(description = "Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    String mainContactEmail;
    @Schema(description = "Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    String mainContactPhone;
    @Schema(description = "Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    String techContactName;
    @Schema(description = "Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    String techContactEmail;
    @Schema(description = "Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    String techContactPhone;
    @Schema(description = "Creation date of organization or organization invite", requiredMode = Schema.RequiredMode.REQUIRED)
    OffsetDateTime createdAt;
}
