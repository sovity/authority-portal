package de.sovity.authorityportal.web.services.dataoffer

import de.sovity.edc.ext.wrapper.api.common.model.DataSourceAvailability

fun DataSourceAvailability.fromString(str: String): DataSourceAvailability {
    return when (str) {
        "LIVE" -> DataSourceAvailability.LIVE
        "ON_REQUEST" -> DataSourceAvailability.ON_REQUEST
        else -> throw IllegalArgumentException("Unknown availability: $this")
    }
}
