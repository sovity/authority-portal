package de.sovity.authorityportal.web.services.reporting

import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.reporting.utils.CsvColumn
import de.sovity.authorityportal.web.services.reporting.utils.buildCsv
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalDataOfferInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.io.ByteArrayInputStream
import java.time.OffsetDateTime

@ApplicationScoped
class DataOfferCsvReportService {

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    data class DataOfferReportRow(
        val dataOfferId: String,
        val dataOfferName: String,
        val organizationMdsId: String,
        val organizationName: String,
        val status: String
    )

    val columns = listOf<CsvColumn<DataOfferReportRow>>(
        CsvColumn("Data Offer ID") { it.dataOfferId },
        CsvColumn("Data Offer Name") { it.dataOfferName },
        CsvColumn("Organization MDS ID") { it.organizationMdsId },
        CsvColumn("Organization Name") { it.organizationName },
        CsvColumn("Status") { it.status }
    )

    fun generateDataOffersCsvReport(environmentId: String): ByteArrayInputStream {
        val rows = buildDataOfferReportRows(environmentId)
        return buildCsv(columns, rows)
    }

    private fun buildDataOfferReportRows(environmentId: String): List<DataOfferReportRow> {
        val connectorEndpoints = connectorService.getConnectorsByEnvironment(environmentId).map { it.endpointUrl }
        val organizationNames = organizationService.getAllOrganizationNames()
        val dataOffers = flatten(brokerClientService.forEnvironment(environmentId).getDataOffersInfo(connectorEndpoints))

        return dataOffers.map {
            val mdsId = extractMdsIdFromConnectorId(it.participantId)
            DataOfferReportRow(
                dataOfferId = it.dataOfferId,
                dataOfferName = it.dataOfferName,
                organizationMdsId = mdsId,
                organizationName = organizationNames[mdsId] ?: "",
                status = it.onlineStatus.toString()
            )
        }
    }

    private fun extractMdsIdFromConnectorId(connectorId: String): String {
        return connectorId.split(".").firstOrNull() ?: connectorId
    }

    data class FlattenedDataOfferInfo(
        val connectorEndpoint: String,
        val participantId: String,
        val onlineStatus: ConnectorOnlineStatus,
        val offlineSinceOrLastUpdatedAt: OffsetDateTime,
        val dataOfferName: String,
        val dataOfferId: String
    )

    private fun flatten(infos: List<AuthorityPortalDataOfferInfo>): List<FlattenedDataOfferInfo> {
        return infos.flatMap { info ->
            info.dataOffers.map { dataOffer ->
                FlattenedDataOfferInfo(
                    info.connectorEndpoint,
                    info.participantId,
                    info.onlineStatus,
                    info.offlineSinceOrLastUpdatedAt,
                    dataOffer.dataOfferName,
                    dataOffer.dataOfferId
                )
            }
        }
    }
}
