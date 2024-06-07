package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Possible user registration statuses.", enumAsRef = true)
enum class UserRegistrationStatusDto {
    INVITED,  // User that has been invited to be a participant user
    ONBOARDING,  // User that has been invited to be a participant admin
    PENDING,  // User awaiting approval of his self-registration
    ACTIVE,  // Active fully registered approved User
    REJECTED,  // User who got his self-registration rejected
    DEACTIVATED // User that has been deactivated, no access to the portal
}

