package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Organization information.")
public class OrganizationDetailsDto {

    @Schema(description = "MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mdsId;
    @Schema(description = "Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;
    @Schema(description = "Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String address;
    @Schema(description = "DUNS number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String duns;
    @Schema(description = "URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;
    @Schema(description = "Email address for security related issues", requiredMode = Schema.RequiredMode.REQUIRED)
    private String securityEmail;
    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    private OrganizationRegistrationStatusDto registrationStatus;
    @Schema(description = "Creation date of organization or organization invite", requiredMode = Schema.RequiredMode.REQUIRED)
    private OffsetDateTime createdAt;
    @Schema(description = "Creator of organization or organization invite", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdBy;
    @Schema(description = "Member count", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer memberCount;
    @Schema(description = "Connector count", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer connectorCount;
    @Schema(description = "Data offer count", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer dataOfferCount;
    @Schema(description = "Member information", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<MemberInfo> memberInfos;
}
