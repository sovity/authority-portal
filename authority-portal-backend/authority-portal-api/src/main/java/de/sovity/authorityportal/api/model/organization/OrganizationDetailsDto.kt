package de.sovity.authorityportal.api.model.organization

import de.sovity.authorityportal.api.model.MemberInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Organization information.")
class OrganizationDetailsDto(
    @Schema(description = "MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val mdsId: String,
    @Schema(description = "Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,
    @Schema(description = "Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    val businessUnit: String,
    @Schema(description = "Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    val industry: String,
    @Schema(description = "Main Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainAddress: String,
    @Schema(description = "Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val billingAddress: String,
    @Schema(description = "Legal ID type", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalIdType: OrganizationLegalIdTypeDto,
    @Schema(description = "Legal ID number", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalId: String,
    @Schema(description = "Commerce register location (if applicable)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val commerceRegisterLocation: String?,
    @Schema(description = "URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    val url: String,
    @Schema(description = "Description of what the company does/is", requiredMode = Schema.RequiredMode.REQUIRED)
    val description: String,
    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    val registrationStatus: OrganizationRegistrationStatusDto,
    @Schema(description = "Member count", requiredMode = Schema.RequiredMode.REQUIRED)
    val memberCount: Int,
    @Schema(description = "Connector count", requiredMode = Schema.RequiredMode.REQUIRED)
    var connectorCount: Int,
    @Schema(description = "Data offer count", requiredMode = Schema.RequiredMode.REQUIRED)
    var dataOfferCount: Int,
    @Schema(description = "Member information", requiredMode = Schema.RequiredMode.REQUIRED)
    val memberList: List<MemberInfo>,
    @Schema(description = "Organization creator: User Id", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByUserId: String,
    @Schema(description = "Organization creator: First Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByFirstName: String,
    @Schema(description = "Organization creator: Last Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByLastName: String,
    @Schema(description = "Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactName: String,
    @Schema(description = "Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactEmail: String,
    @Schema(description = "Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactPhone: String,
    @Schema(description = "Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactName: String,
    @Schema(description = "Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactEmail: String,
    @Schema(description = "Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactPhone: String,
    @Schema(
        description = "Creation date of organization or organization invite",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val createdAt: OffsetDateTime,
)
