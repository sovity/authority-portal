package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.UserOnboardingTypeDto
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType

fun UserOnboardingType.toDto(): UserOnboardingTypeDto = when (this) {
    UserOnboardingType.INVITATION -> UserOnboardingTypeDto.INVITATION
    UserOnboardingType.SELF_REGISTRATION -> UserOnboardingTypeDto.SELF_REGISTRATION
}

fun UserOnboardingTypeDto.toDb(): UserOnboardingType = when (this) {
    UserOnboardingTypeDto.INVITATION -> UserOnboardingType.INVITATION
    UserOnboardingTypeDto.SELF_REGISTRATION -> UserOnboardingType.SELF_REGISTRATION
}
