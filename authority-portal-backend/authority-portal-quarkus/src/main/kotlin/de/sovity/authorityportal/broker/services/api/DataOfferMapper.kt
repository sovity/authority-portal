package de.sovity.authorityportal.broker.services.api

import com.fasterxml.jackson.databind.ObjectMapper
import de.sovity.edc.ext.wrapper.api.common.model.UiAsset
import de.sovity.edc.ext.wrapper.api.common.model.UiPolicy
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class DataOfferMapper(
    val objectMapper: ObjectMapper
) {
    fun readUiAsset(json: String): UiAsset = objectMapper.readValue(json, UiAsset::class.java)
    fun readUiPolicy(json: String): UiPolicy = objectMapper.readValue(json, UiPolicy::class.java)
}
