package de.sovity.authorityportal.web.thirdparty.broker.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Number of Data Offers per Connector endpoint.")
class DataOfferCountResult {
    @Schema(description = "Map from endpoint URL to Data Offer count", requiredMode = Schema.RequiredMode.REQUIRED)
    var dataOfferCount: Map<String, Int> = mutableMapOf()
}

