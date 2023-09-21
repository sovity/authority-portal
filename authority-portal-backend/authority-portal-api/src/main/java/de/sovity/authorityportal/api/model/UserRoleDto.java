package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Available user roles.")
public enum UserRoleDto {
    OPERATOR_ADMIN,
    SERVICEPARTNER_ADMIN,
    AUTHORITY_ADMIN,
    AUTHORITY_USER,
    PARTICIPANT_ADMIN,
    PARTICIPANT_CURATOR,
    PARTICIPANT_USER
}

