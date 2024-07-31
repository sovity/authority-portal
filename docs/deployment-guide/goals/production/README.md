Deploying the Authority Portal in Production
============

## About this Guide

This is a productive deployment guide for deploying the Authority Portal from scratch.

## Prerequisites

### Technical Skills

- Ability to deploy, run and expose containered applications to the internet.
- Ability to configure ingress routes or a reverse proxy of your choice to merge multiple services under a single
  domain.
- Ability to maintain a Keycloak

### Dataspace

- Each configured Dataspace Deployment Environment must have a running sovity Keycloak DAPS.
- Each configured Dataspace Deployment Environment must have a running Logging House.
- To make use of the Data Catalog, each configured Dataspace Deployment Environment must have configured a running Catalog Crawler (based on the sovity EDC Connector).

The respective compatible versions can be found in the [CHANGELOG.md](../../../../CHANGELOG.md).

### Third Party

- Information about a running instance of the sovity CaaS-Portal ist required.
  - URL of the CaaS-Portal, referred to as `[CAAS_PORTAL_FQDN]` in this guide.
  - URL of the Keycloak for authorizing at the CaaS-Portal, referred to as `[CAAS_KC_FQDN]` in this guide.
  - Credentials for the CaaS-Portal, referred to as `[CAAS_CLIENT_ID]` and `[CAAS_CLIENT_SECRET]` in this guide.
- A running instance of Uptime Kuma is required.
  - This should track the DAPS, Logging House and Catalog Crawler status
  - The statuses must be available via the API (`/metrics` endpoint)
    - The output per component should look like this:
      ```
      monitor_status{monitor_name="[Component name]", ...} [INTEGER]
      ```
  - URL of the Uptime Kuma, referred to as `[UPTIME_KUMA_FQDN]` in this guide.
  - API key for the Uptime Kuma, referred to as `[UPTIME_KUMA_API_KEY]` in this guide.

## Deployment

### Deployment Units

| Deployment Unit           | Version / Details                                                                                        |
|---------------------------|----------------------------------------------------------------------------------------------------------|
| Reverse Proxy / Ingress   | _Infrastructure dependant_                                                                               |
| Keycloak Deployment       | Version 24.0.4 or compatible version                                                                     |
| OAuth2 Proxy              | quay.io/oauth2-proxy/oauth2-proxy:7.5.0                                                                  |
| Caddy behind OAuth2 Proxy | caddy:2.7                                                                                                |
| Authority Portal Backend  | authority-portal-backend, see [CHANGELOG.md](../../../../CHANGELOG.md) for compatible versions.          |
| Authority Portal Frontend | authority-portal-frontend, see  [CHANGELOG.md](../../../../CHANGELOG.md) for compatible versions.        |
| Catalog Crawler           | ghcr.io/sovity/catalog-crawler-ce, see [CHANGELOG.md](../../../../CHANGELOG.md) for compatible versions. |
| Postgresql                | Version 16 or compatible version                                                                         |

### Configuration

#### Reverse Proxy / Ingress

- Authority Portal needs to be deployed with TLS/HTTPS.
- The domain under which the Authority Portal should be reachable on the internet will be referred to as `[AP_FQDN]` in this
  guide.
- Path mapping: 
  - Frontend: `https://[AP_FQDN]` -> `caddy:8080` -> `frontend:8080`
  - Backend: `https://[AP_FQDN]/api` -> `caddy:8080` -> `oauth2-proxy:8080` -> `caddy:8081` -> `backend:8080/api`

#### Keycloak IAM Deployment

- The Keycloak needs to get the following env variables it uses in the container:

```yaml
  # Variables to set privacy policy and legal notice URLs on Keycloak pages
  KEYCLOAK_PRIVACY_POLICY_URL: https://mobility-dataspace.online/privacy-policy-mds-portal
  KEYCLOAK_LEGAL_NOTICE_URL: https://mobility-dataspace.eu/legal-notice
```

- Consider consulting Keycloak's [server administration guide](https://www.keycloak.org/docs/latest/server_admin/).
- You need to have a running keycloak with the aforementioned compatible version.
- The domain under which the Keycloak should be reachable on the internet will be referred to as `[KC_FQDN]` in this
  guide and should differ from the `[AP_FQDN]`.
- The steps to set up the realm are the following
   1. Copy [mds-theme](../../../../authority-portal-keycloak/mds-theme) directory to `{keycloakRoot}/themes/` directory
   2. Import [realm.json](../../../../authority-portal-backend/authority-portal-quarkus/src/main/resources/realm.json) to create `mds-portal` realm
   3. Adjust settings for `oauth2-proxy` client (Clients > `oauth2-proxy` > Settings)
      - `Root URL`: URL of the auth proxy, e.g. `https://authority-portal.example.url`
      - `Home URL`: (Relative) sign in URL of auth proxy, e.g. `/oauth2/sign_in`
      - `Valid Redirect URIs`: (Relative) callback URL of auth proxy, e.g. `/oauth2/callback`
      - `Valid post logout redirect URIs`: `/*`
   4. Adjust settings for `authority-portal-client` client (Clients > `authority-portal-client` > Settings)
      - `Root URL`: URL of the authority portal, e.g. `https://authority-portal.example.url`
      - `Home URL`: (Most likely) same as `Root URL`
   5. Regenerate client secrets for `oauth2-proxy` and `authority-portal-client` clients
      - Clients > `[client]` > Credentials > Regenerate (Client secret)
   6. Select MDS theme for login & email templates
      - Select `mds-portal` realm
      - Realm settings > Themes > Login theme: Select `mds-theme`
      - Realm settings > Themes > Email theme: Select `mds-theme`
   7. Add email settings (Realm settings > Email)
      - At least `From` and `Host` are required

#### Caddy

The [Caddyfile](./Caddyfile) needs to be mounted to `/etc/caddy/Caddyfile` in the Caddy container.
See the list of deployment units for the compatible Caddy image.

The Caddy needs to get the following env variables it uses in the container:

  ```yaml
BACKEND_UPSTREAM_HOST: backend
FRONTEND_UPSTREAM_HOST: frontend
AUTH_PROXY_UPSTREAM_HOST: auth-proxy
```

#### OAuth2 Proxy

- The Authority Portal is meant to be deployed with an OAuth2 Proxy in front of the Portal Backend.
- The OAuth2 Proxy should be configured to use the Keycloak (IAM) as OAuth2 Provider.
- Copy the contents from [resources](../../../../authority-portal-oauth2-proxy/resources) to a directory the OAuth2 proxy can access (`CUSTOM_TEMPLATES_DIR`)

```yaml
OAUTH2_PROXY_PROVIDER: keycloak-oidc
OAUTH2_PROXY_PROVIDER_DISPLAY_NAME: Keycloak
OAUTH2_PROXY_OIDC_ISSUER_URL: https://[KC_FQDN]/realms/mds-portal
OAUTH2_PROXY_COOKIE_SECRET: [COOKIE_SECRET] # (32-bit base64 encoded secret)
OAUTH2_PROXY_COOKIE_REFRESH: 30s # Access Token Lifespan - 30 seconds
OAUTH2_PROXY_COOKIE_EXPIRE: 30m # Client Session Idle / SSO Session Idle
OAUTH2_PROXY_CLIENT_ID: oauth2-proxy
OAUTH2_PROXY_CLIENT_SECRET: [OA2_CLIENT_SECRET]
OAUTH2_PROXY_EMAIL_DOMAINS: "*"
OAUTH2_PROXY_UPSTREAMS: http://caddy:8081/
OAUTH2_PROXY_API_ROUTES: "^/api/"
OAUTH2_PROXY_SKIP_AUTH_ROUTES: "^(/oauth2|/api/registration|/api/config)"
OAUTH2_PROXY_HTTP_ADDRESS: 0.0.0.0:8080
OAUTH2_PROXY_PASS_ACCESS_TOKEN: "true"
OAUTH2_PROXY_SKIP_PROVIDER_BUTTON: "true"
OAUTH2_PROXY_SHOW_DEBUG_ON_ERROR: "true"
OAUTH2_PROXY_REDIRECT_URL: https://[AP_FQDN]/oauth2/callback
OAUTH2_PROXY_SCOPE: openid profile
OAUTH2_PROXY_WHITELIST_DOMAINS: [KC_FQDN]
OAUTH2_PROXY_CUSTOM_TEMPLATES_DIR: [CUSTOM_TEMPLATES_DIR]
```

#### Keycloak DAPS Client Creation

The Authority Portal requires a client to register new connector certificates.
This client must have the following settings:

- Section `Authentication flow` (Tab `Settings`)
  - Everything disabled
  - `Service accounts roles` enabled
- Tab `Client scopes`
  - Add client scope `roles` as a default scope to the client
- Service account roles (Tab `Service Account Roles`)
  - `realm-management` > `manage-clients` enabled
  - `realm-management` > `create-client` enabled
  - `realm-management` > `view-clients` enabled
  - `realm-management` > `query-clients` enabled

#### Authority Portal Backend

- Image: `ghcr.io/sovity/authority-portal-backend`
- Set environment variables according to the following documentation (mandatory, except log level)

```yaml
# Postgres DB Connection
quarkus.datasource.jdbc.url: "jdbc:postgresql://portal-db/authority_portal"
quarkus.datasource.username: "postgres"
quarkus.datasource.password: "postgres"

# Keycloak Client for User IAM
# Base URL of the OIDC server (Keycloak). Must contain the '/realms/{realm}' part of the URL
quarkus.oidc.auth-server-url: "https://[KC_FQDN]/realms/mds-portal"

# Keycloak Admin Client
# Keycloak Admin Client: Server URL
quarkus.keycloak.admin-client.server-url: "https://[KC_FQDN]"
# Keycloak Admin Client: Realm
quarkus.keycloak.admin-client.realm: "mds-portal"
# Keycloak Admin Client: Client ID
quarkus.keycloak.admin-client.client-id: "authority-portal-client"
# Keycloak Admin Client: Client secret
quarkus.keycloak.admin-client.client-secret: "[AP_CLIENT_SECRET]"
# Keycloak Admin Client: Grant type
quarkus.keycloak.admin-client.grant-type: "CLIENT_CREDENTIALS"

# Log level for backend logging (ERROR, INFO, DEBUG, etc). Docs: https://quarkus.io/guides/logging
quarkus.log.level: "INFO"

# CaaS Portal
# CaaS Portal: URL
authority-portal.caas.sovity.url: "https://[CAAS_PORTAL_FQDN]"
# CaaS Portal: OAuth2 Auth server URL
quarkus.oidc-client.sovity.auth-server-url: "https://[CAAS_KC_FQDN]/realms/[REALM]"
# CaaS Portal: OAuth2 Client ID
quarkus.oidc-client.sovity.client-id: "[CAAS_CLIENT_ID]"
# CaaS Portal: OAuth2 Client Secret
quarkus.oidc-client.sovity.credentials.secret: "[CAAS_CLIENT_SECRET]"
# Amount of free sovity CaaS per participant
authority-portal.caas.sovity.limit-per-mdsid: "1"

# Must equal the root URL/home URl from the Keycloak configuration - see above)
authority-portal.base-url: "https://[AP_FQDN]"

# API key to protect config endpoints, like /api/config/log-level
authority-portal.config.api-key: "[AP_CONFIG_API_KEY]"

# Invitation link expiration time in seconds. (Must equal the value in Keycloak configuration)
authority-portal.invitation.expiration: "43200"

# Uptime Kuma
# Uptime Kuma URL (/metrics endpoint must be available)
authority-portal.kuma.metrics-url: "https://[UPTIME_KUMA_FQDN]"
# Uptime Kuma API key
authority-portal.kuma.api-key: "[UPTIME_KUMA_API_KEY]"

# Environment Configuration
# - Each Authority Portal can be configured with multiple environments, e.g. test, staging, prod, etc. 
# - Following is an example configuration of the "test" environment.
# - Please Note, that the environment "test" is mandatory

# Environment Configuration: Metadata
# Title of the deployment environment configuration
authority-portal.deployment.environments.test.title: "Test"
# Order of environments, from 0 (default) to n (least important)
authority-portal.deployment.environments.test.position: "0"

# Environment Data Catalog Settings
# Time after which offline data offers are hidden from the Data Catalog
authority-portal.deployment.environments.test.data-catalog.hide-offline-data-offers-after: "15m"
# Default page size for the Data Catalog
authority-portal.deployment.environments.test.data-catalog.catalog-page-page-size: "10"
# Kuma name for the catalog crawler
authority-portal.deployment.environments.test.data-catalog.kuma-name: broker

# Environment Connector-Dataspace association: Allows certain connectors to be associated as partnered data spaces
# Required: Default Dataspace name
authority-portal.deployment.environments.test.data-catalog.dataspace-names.default: "MDS"
# Optional: Additional connectors to be given a dataspace name
authority-portal.deployment.environments.test.data-catalog.dataspace-names.connectorIds."MDSL1234XX.C1234XX": "Mobilithek"

# Environment DAPS
# Env: DAPS URL
authority-portal.deployment.environments.test.daps.url: "https://[KC_DAPS_FQDN]"
# Env: DAPS realm name
authority-portal.deployment.environments.test.daps.realm-name: "DAPS"
# Env: DAPS Admin Client Client ID
authority-portal.deployment.environments.test.daps.client-id: "authority-portal"
# Env: DAPS Admin Client Client Secret
authority-portal.deployment.environments.test.daps.client-secret: "[DAPS_CLIENT_SECRET]"
# Env: DAPS Kuma name
authority-portal.deployment.environments.test.daps.kuma-name: "[DAPS_KUMA_NAME]"

# Environment Logging House
# Env: Logging House URL
authority-portal.deployment.environments.test.logging-house.url: "https://[LOGGING_HOUSE_FQDN]"
# Env: Logging House Kuma name
authority-portal.deployment.environments.test.logging-house.kuma-name: "[LOGGING_HOUSE_KUMA_NAME]"
```

#### Adjusting the log level at runtime

The log level can be changed during runtime via a request to the `/api/config/log-level` endpoint. 
The API key is required for this.
Example:

```bash
curl -X PUT 'https://authority-portal.example.com/api/config/log-level?level=DEBUG' --header 'x-api-key: uYtR_wNsvXU4EbV9GioACnj!NHML_HRX'
```

#### Authority Portal Frontend

- Image: `ghcr.io/sovity/authority-portal-frontend`
- Set environment variables according to the following table (mandatory)

```yaml
AUTHORITY_PORTAL_FRONTEND_BACKEND_URL: https://[AP_FQDN] # Authority Portal URL
AUTHORITY_PORTAL_FRONTEND_LOGIN_URL: https://[AP_FQDN]/oauth2/start?rd=https%3A%2F%2F[AP_FQDN] # Auth Proxy: Login URL (with redirect to the Authority Portal)
# Following is the URL to signal the Auth Proxy to log out the user.
# Example: https://[AP_FQDN]/oauth2/sign_out?rd=https%3A%2F%2F[KC_FQDN]%2Frealms%2Fmds-portal%2Fprotocol%2Fopenid-connect%2Flogout%3Fclient_id%3Doauth2-proxy%26post_logout_redirect_uri%3Dhttps%253A%252F%252F[AP_FQDN]
AUTHORITY_PORTAL_FRONTEND_LOGOUT_URL: (...) # Auth Proxy: Logout URL
AUTHORITY_PORTAL_FRONTEND_INVALIDATE_SESSION_COOKIES_URL: https://[AP_FQDN]/oauth2/sign_out # Auth Proxy: URL to invalidate sessions cookies
AUTHORITY_PORTAL_FRONTEND_IFRAME_URL: https://mobility-dataspa-5n9px2qi7r.live-website.com/mds-news # MDS Dashboard iFrame URL
AUTHORITY_PORTAL_FRONTEND_LEGAL_NOTICE_URL: https://mobility-dataspace.eu/legal-notice # Authority Portal Legal Notice URL
AUTHORITY_PORTAL_FRONTEND_PRIVACY_POLICY_URL: https://mobility-dataspace.online/privacy-policy-mds-portal # MDS Privacy Policy URL
AUTHORITY_PORTAL_FRONTEND_SUPPORT_URL: https://support.mobility-dataspace.eu # Support page URL
```

### Data Catalog Crawlers

- The Data Catalog only displays the Data Catalog as it exists in the database.
- Each deployment environment requires a Data Catalog Crawler.
  - A Data Catalog Crawler is based on the EDC Connector and crawls the catalogs of all connectors in the dataspace.
  - You will need an SKI/AKI client ID to register the crawler. Please refer to the [EDC documentation](https://github.com/sovity/edc-ce/tree/main/docs/getting-started#faq) on how to generate one.
- See the [Catalog Crawler Productive Deployment Guide](https://github.com/sovity/edc-ce/blob/v10.0.0/docs/deployment-guide/goals/catalog-crawler-production/README.md) 

## Initial Setup

The **first** user that registers at the portal does not need to be approved and will automatically become an `Authority Admin`.
This means *this should be done by the Dataspace Authority*
