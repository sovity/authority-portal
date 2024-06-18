package de.sovity.authorityportal.web.utils

import jakarta.enterprise.context.ApplicationScoped
import java.time.OffsetDateTime

@ApplicationScoped
class TimeUtils {
    fun now() = OffsetDateTime.now()
}
