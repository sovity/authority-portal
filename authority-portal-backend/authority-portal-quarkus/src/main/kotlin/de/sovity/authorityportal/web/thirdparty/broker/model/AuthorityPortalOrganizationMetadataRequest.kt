package de.sovity.authorityportal.web.thirdparty.broker.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Information about organizations from the Authority Portal.")
class AuthorityPortalOrganizationMetadataRequest {
    @Schema(description = "Organization metadata")
    var organizations: List<AuthorityPortalOrganizationMetadata>? = null
}
