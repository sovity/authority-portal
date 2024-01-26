MDS Broker Client
============

## About This Component

API Client for connecting to the MDS Broker API.
It is mandatory for this component to be exactly aligned with the Broker version, which is stated as compatible in the [CHANGELOG.md](../../../../../../../../../../../CHANGELOG.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API Documentation

_This documentation refers to the [BrokerClientResource](BrokerClientResource.kt) interface. An implementation of this can be found in the [BrokerClient](BrokerClient.kt)._

Base Path: `backend/api/management/wrapper/broker`  
Config of URL and API keys happens via environment variables: `authority-portal.deployment.environments.[environmentId].broker.[...]`

- `PUT /connectors`
    - Description: Add connector endpoints for the Broker to query.
    - Request
        - Header Parameters:
            - `X-Api-Key`: API key from config
        - Query Parameters:
            - `adminApiKey`: Admin API key from config
        - Body
            - Type: `application/json`
            - Schema: `List<String>` (Connector **endpoints**)
    - Response
        - Status Code: `204`
        - Body: empty

- `DELETE /connectors`
    - Description: Remove connector endpoints known by the Broker.
    - Request
        - Header Parameters:
            - `X-Api-Key`: API key from config
        - Query Parameters:
            - `adminApiKey`: Admin API key from config
        - Body
            - Type: `application/json`
            - Schema: `List<String>` (Connector **endpoints**)
    - Response
        - Status Code: `204`
        - Body: empty

- `POST /authority-portal-api/connectors`
    - Description: Fetch connector metadata (for each connector endpoint in the request) from the Broker. This includes participantId (known as connectorId in the Authority Portal), dataOfferCount (publicly visible) of the connector, onlineStatus and offlineSinceOrLastUpdatedAt.
    - Request
        - Header Parameters:
            - `X-Api-Key`: API key from config
        - Query Parameters:
            - `adminApiKey`: Admin API key from config
        - Body
            - Type: `application/json`
            - Schema: `List<String>` (Connector **endpoints**)
    - Response
        - Status Code: `200`
        - Body
            - Type: `application/json`
            - Schema: `List<AuthorityPortalConnectorInfo>`
                ```
                    [
                        {
                            "connectorEndpoint": String,
                            "participantId": String, (known as connectorId in the Authority Portal)
                            "dataOfferCount": Int, (only publicly visible ones)
                            "onlineStatus": ConnectorOnlineStatus?,
                            "offlineSinceOrLastUpdatedAt": OffsetDateTime?
                        },
                        ...
                    ]
                ```

- `POST /authority-portal-api/organization-metadata`
    - Description: Push organization metadata to the Broker. Note that this sets the metadata **exactly** to the provided metadata, deleting all previous data.
    - Request
        - Header Parameters:
            - `X-Api-Key`: API key from config
        - Query Parameters:
            - `adminApiKey`: Admin API key from config
        - Body
            - Type: `application/json`
            - Schema: `List<AuthorityPortalOrganizationMetadataRequest>`
                ```
                    {
                        "organizations": [
                            {
                                "mdsId": String, (Part of the participantId of a connector)
                                "name": String
                            },
                            ...
                        ]
                    }
                ```
    - Response
        - Status Code: `204`
        - Body: empty
