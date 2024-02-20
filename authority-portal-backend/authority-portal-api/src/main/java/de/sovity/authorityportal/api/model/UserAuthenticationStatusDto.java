package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum UserAuthenticationStatusDto {
    AUTHENTICATED,
    UNAUTHENTICATED
}
