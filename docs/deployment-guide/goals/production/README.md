Deploying the Authority Portal in Production
============

## About this Guide

This is a productive deployment guide for deploying the Authority Portal from scratch as either the MDS integrator or
operator company.

## Prerequisites

### Technical Skills

- Ability to deploy, run and expose containered applications to the internet.
- Ability to configure ingress routes or a reverse proxy of your choice to merge multiple services under a single
  domain.
- Ability to maintain a Keycloak

### Dataspace

- Each configured Dataspace Deployment Environment must have a running sovity Keycloak DAPS.
- Each configured Dataspace Deployment Environment must have a running EDC Broker.

The respective compatible versions can be found in the [CHANGELOG.md](../../../../CHANGELOG.md).

## Deployment

We are awaiting a working Test Process with Sirius, which we can base the productive deployment guide on.

### Deployment Units

| Deployment Unit           | Version / Details                                                                                 |
|---------------------------|---------------------------------------------------------------------------------------------------|
| Reverse Proxy / Ingress   | _Infrastructure dependant_                                                                        |
| Keycloak Deployment       | Version 23.0.4 or compatible version                                                              |
| OAuth2 Proxy              | quay.io/oauth2-proxy/oauth2-proxy:7.5.0                                                           |
| Caddy behind OAuth2 Proxy | caddy:2.7                                                                                         |
| Authority Portal Backend  | authority-portal-backend, see [CHANGELOG.md](../../../../CHANGELOG.md) for compatible versions.   |
| Authority Portal Frontend | authority-portal-frontend, see  [CHANGELOG.md](../../../../CHANGELOG.md) for compatible versions. |
| Postgresql                | Version 16 or compatible version                                                                  |

### Configuration

#### Reverse Proxy / Ingress

- Authority Portal needs to be deployed with TLS/HTTPS.
- The domain under which the Authority Portal should be reachable on the internet will be referred to as `[AP_FQDN]` in this
  guide.
- Path mapping: 
  - Frontend: `https://[AP_FQDN]` -> `oauth2-proxy:8080` -> `caddy:8080` -> `frontend:8080`
  - Backend: `https://[AP_FQDN]/api` -> `oauth2-proxy:8080` -> `caddy:8080` -> `backend:8080/api`

#### Keycloak IAM Deployment

- You need to have a running keycloak with the aforementioned compatible version.
- The domain under which the Keycloak should be reachable on the internet will be referred to as `[KC_FQDN]` in this
  guide and should differ from the `[AP_FQDN]`.
- The steps to set up the realm are the following
   1. Copy [mds-theme](../../../../authority-portal-keycloak/mds-theme) directory to `{keycloakRoot}/themes/` directory
   2. Import [realm.json](../../../../authority-portal-backend/authority-portal-quarkus/src/main/resources/realm.json) to create `authority-portal` realm
   3. Adjust settings for `oauth2-proxy` client (Clients > `oauth2-proxy` > Settings)
      - `Root URL`: URL of the auth proxy, e.g. `https://authority-portal.example.url`
      - `Home URL`: (Most likely) same as `Root URL`
      - `Valid Redirect URIs`: (Relative) callback URL of auth proxy, e.g. `/oauth2/callback`
      - `Valid post logout redirect URIs`: `/*`
   4. Regenerate client secret for `oauth2-proxy` and `authority-portal-client` clients
      - Clients > `[client]` > Credentials > Regenerate (Client secret)
   5. Select MDS theme for login & email templates
      - Select `authority-portal` realm
      - Realm settings > Themes > Login theme: Select `mds-theme`
      - Realm settings > Themes > Email theme: Select `mds-theme`
   6. Add email settings (Realm settings > Email)
      - At least `From` and `Host` are required

#### OAuth2 Proxy

- The Authority Portal is meant to be deployed with an OAuth2 Proxy in front of the Reverse Proxy.
- The OAuth2 Proxy should be configured to use the Keycloak (IAM) as OAuth2 Provider.  

```yaml
OAUTH2_PROXY_PROVIDER: keycloak-oidc
OAUTH2_PROXY_PROVIDER_DISPLAY_NAME: Keycloak
OAUTH2_PROXY_OIDC_ISSUER_URL: https://[KC_FQDN]/realms/authority-portal
OAUTH2_PROXY_COOKIE_SECRET: [COOKIE_SECRET] # (32-bit base64 encoded secret)
OAUTH2_PROXY_CLIENT_ID: oauth2-proxy
OAUTH2_PROXY_CLIENT_SECRET: [OA2_CLIENT_SECRET]
OAUTH2_PROXY_COOKIE_REFRESH: 4m # Access Token Lifespan - 1 minute
OAUTH2_PROXY_COOKIE_EXPIRE: 30m # Client Session Idle / SSO Session Idle
OAUTH2_PROXY_EMAIL_DOMAINS: "*"
OAUTH2_PROXY_UPSTREAMS: http://caddy:8080
OAUTH2_PROXY_HTTP_ADDRESS: 0.0.0.0:8080
OAUTH2_PROXY_PASS_ACCESS_TOKEN: "true"
OAUTH2_PROXY_SKIP_AUTH_ROUTE: ^/oauth2
OAUTH2_PROXY_SKIP_PROVIDER_BUTTON: "true"
OAUTH2_PROXY_SHOW_DEBUG_ON_ERROR: "true"
OAUTH2_PROXY_REDIRECT_URL: https://[AP_FQDN]/oauth2/callback
OAUTH2_PROXY_SCOPE: openid profile
OAUTH2_PROXY_WHITELIST_DOMAINS: [KC_FQDN]
```

#### Caddy

The [Caddyfile](../sirius/remote/Caddyfile) needs to be mounted to `/etc/caddy/Caddyfile` in the Caddy container.
See the list of deployment units for the compatible Caddy image.

The Caddy needs to get the following env variables it uses in the container:

```yaml
BACKEND_UPSTREAM_HOST: backend
FRONTEND_UPSTREAM_HOST: frontend
```

#### Keycloak DAPS Client Creation

The Authority Portal requires a client to register new connector certificates.
This client must have the following settings:

- Section `Authentication flow` (Tab `Settings`)
  - Everything disabled
  - `Service accounts roles` enabled
- Section `Access Settings` (Tab `Settings`)
  - `Root URL` set to the base URL of the Authority Portal Frontend (e.g. `https://authority-portal.my-org.com`)
  - `Home URL` set to the same value as `Root URL`
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
quarkus.datasource.jdbc.url: jdbc:postgresql://portal-db/authority_portal # Postgres URL
quarkus.datasource.username: postgres # Postgres user
quarkus.datasource.password: postgres # Postgres password
quarkus.oidc.auth-server-url: https://[KC_FQDN]/realms/authority-portal # Base URL of the OIDC server (Keycloak). Must contain the '/realms/{realm}' part of the URL
quarkus.keycloak.admin-client.server-url: https://[KC_FQDN] # Keycloak Admin Client: Server URL
quarkus.keycloak.admin-client.realm: authority-portal # Keycloak Admin Client: Realm
quarkus.keycloak.admin-client.client-id: authority-portal-client # Keycloak Admin Client: Client ID
quarkus.keycloak.admin-client.client-secret: [AP_CLIENT_SECRET] # Keycloak Admin Client: Client secret
quarkus.keycloak.admin-client.grant-type: CLIENT_CREDENTIALS # Keycloak Admin Client: Grant type
quarkus.log.level: INFO # Log level for backend logging (ERROR, INFO, DEBUG, etc). Docs: https://quarkus.io/guides/logging
authority-portal.connectors.url.frontend: / # Connector base URL extension: Frontend path
authority-portal.connectors.url.management: /api/management # Connector base URL exception: Managemant API path
authority-portal.connectors.url.endpoint: /api/dsp # Connector base URL extension: Endpoint path (primarly used by broker)
authority-portal.invitation.expiration: 43200 # Invitation link expiration time in seconds. (Must equal the value in Keycloak configuration)
authority-portal.base-url: https://authority-portal.my-org.com # Must equal the root URL/home URl from the Keycloak configuration - see above)
# Following is **one** deployment environment configuration. (See hint below)
authority-portal.deployment.environments.test.title: Test # Env: Title of the deployment environment configuration
authority-portal.deployment.environments.test.position: 0  # Env: Order of environments, from 0 (default) to n (least important)
authority-portal.deployment.environments.test.broker.url: https://[BROKER_FQDN] # Env: Broker URL
authority-portal.deployment.environments.test.broker.admin-api-key: DefaultBrokerServerAdminApiKey # Env: Broker Admin API key
authority-portal.deployment.environments.test.broker.api-key: ApiKeyDefaultValue # Env: Broker API key
authority-portal.deployment.environments.test.daps.url: https://[KC_DAPS_FQDN] # Env: DAPS URL
authority-portal.deployment.environments.test.daps.realm-name: DAPS # Env: DAPS realm name
authority-portal.deployment.environments.test.daps.client-id: authority-portal # Env: DAPS client ID
authority-portal.deployment.environments.test.daps.client-secret: [DAPS_CLIENT_SECRET] # Env: DAPS client secret
```

Environment `test` is mandatory. Further environments can be configured.

#### Authority Portal Frontend

- Image: `ghcr.io/sovity/authority-portal-frontend`
- Set environment variables according to the following table (mandatory)

```yaml
AUTHORITY_PORTAL_FRONTEND_BACKEND_URL: https://[AP_FQDN] # Authority Portal URL
# Following is the URL to signal the Auth Proxy to log out the user.
# Example: https://${AP_FQDN}/oauth2/sign_out?rd=https%3A%2F%2F${KC_FQDN}%2Frealms%2Fauthority-portal%2Fprotocol%2Fopenid-connect%2Flogout%3Fclient_id%3Doauth2-proxy%26post_logout_redirect_uri%3Dhttps%253A%252F%252F${AP_FQDN}
AUTHORITY_PORTAL_FRONTEND_LOGOUT_URL: (...) # Auth Proxy: Logout URL
AUTHORITY_PORTAL_FRONTEND_INVALIDATE_SESSION_COOKIES_URL: https://[AP_FQDN]/oauth2/sign_out # Auth Proxy: URL to invalidate sessions cookies
```

### Docker Compose Example

For internal testing we have a test deployment to a dev server.

To assist with the productive deployment, we added our internal docker compose file. 

**Please understand that this file is not functional and for reference only.**

[sovity Internal Test Deployment Docker Compose File](../sirius/remote/docker-compose.yaml)

## Initial Setup

The **first** user that registers at the portal does not need to be approved and will automatically become an `Authority Admin`.
This means *this should be done by the Dataspace Authority*
