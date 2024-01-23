package de.sovity.authorityportal.web.thirdparty.broker.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Information about a single organization from the Authority Portal.")
class AuthorityPortalOrganizationMetadata {
    @Schema(description = "MDS-ID from the Authority Portal")
    var mdsId: String = ""
    @Schema(description = "Company name")
    var name: String = ""
}
