package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Available user roles.", enumAsRef = true)
public enum UserRoleDto {
    UNAUTHENTICATED,
    AUTHORITY_ADMIN,
    OPERATOR_ADMIN,
    SERVICE_PARTNER_ADMIN,
    AUTHORITY_USER,
    ADMIN,
    KEY_USER,
    USER
}
