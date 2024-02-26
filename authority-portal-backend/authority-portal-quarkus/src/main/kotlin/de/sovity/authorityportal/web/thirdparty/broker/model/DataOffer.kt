package de.sovity.authorityportal.web.thirdparty.broker.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Detailed information about a data offer")
class DataOffer {
    @Schema(description = "The name of the data offer")
    val dataOfferName: String = ""
    @Schema(description = "The id of the data offer")
    val dataOfferId: String = ""
}
