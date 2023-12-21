package de.sovity.authorityportal.api.model.organization;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible user registration statuses.", enumAsRef = true)
public enum OrganizationRegistrationStatusDto {
    INVITED,
    PENDING,
    ACTIVE,
    REJECTED,
}

