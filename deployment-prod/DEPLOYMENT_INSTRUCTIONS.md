# Deployment Instructions

## Prerequisites

- Running Broker
  - `URL`
  - `Admin API key`
  - `API key`
- Running DAPS
  - `URL`
  - `Realm name`
  - `Client ID`
  - `Client secret`
- Mail server
  - `Host` (+ `Port`)
  - `Mailaddress` (e.g. `noreply@...`)
  - `Credentials`

## Deployment

### Keycloak (v22)

1. Add `mds-theme` to `{keycloakRoot}/themes/` directory
2. Import `realm.json` to create `authority-portal` realm
3. Adjust settings for `oauth2-proxy` client (Clients > `oauth2-proxy` > Settings)
   - `Root URL`: URL of the auth proxy, e.g. `https://authority-portal.example.url`
   - `Home URL`: (Most likely) same as `Root URL`
   - `Valid Redirect URIs`: (Relative) callback URL of auth proxy, e.g. `/oauth2/callback`
   - `Valid post logout redirect URIs`: `/*`
4. Regenerate client secret for `oauth2-proxy` and `authority-portal-client` clients
   - Clients > `[client]` > Credentials > Regenerate (Client secret)
   - Both secrets are needed later
5. Select MDS theme for login
   - Select `authority-portal` realm
   - Realm settings > Themes > Login theme: Select `mds-theme`
6. Add email settings (Realm settings > Email)
   - At least `From` and `Host` are required

### Auth Proxy (+ Reverse Proxy)

- Set up Auth Proxy of your choice with the following requirements
  - Logout and session cookie invalidation URLs
  - Forwarding of access token
  - Usage of `oauth2-proxy` client with corresponding secret
  - Cookie refresh interval of < 5m
- Set up Reverse Proxy to route API calls correctly
  - /api => Backend
  - Other => Frontend
- Ensure that either Auth or Reverse Proxy is configured to send the access token as `Authorization` header with the prefix `Bearer`

#### Example configuration

Auth Proxy

```yaml
image: quay.io/oauth2-proxy/oauth2-proxy:v7.5.0
environment:
  OAUTH2_PROXY_PROVIDER: keycloak-oidc
  OAUTH2_PROXY_PROVIDER_DISPLAY_NAME: Keycloak
  OAUTH2_PROXY_OIDC_ISSUER_URL: https://keycloak.url/realms/authority-portal
  OAUTH2_PROXY_COOKIE_SECRET: [32-bit base64 encoded secret]
  OAUTH2_PROXY_COOKIE_REFRESH: 4m
  OAUTH2_PROXY_CLIENT_ID: oauth2-proxy
  OAUTH2_PROXY_CLIENT_SECRET: [oauth2-proxy client secret]
  OAUTH2_PROXY_EMAIL_DOMAINS: "*"
  OAUTH2_PROXY_UPSTREAMS: http://caddy:8080/
  OAUTH2_PROXY_HTTP_ADDRESS: 0.0.0.0:8080
  OAUTH2_PROXY_PASS_ACCESS_TOKEN: "true"
  OAUTH2_PROXY_SKIP_AUTH_ROUTE: ^/oauth2
  OAUTH2_PROXY_SKIP_PROVIDER_BUTTON: "true"
  OAUTH2_PROXY_SHOW_DEBUG_ON_ERROR: "false"
  OAUTH2_PROXY_REDIRECT_URL: https://authority-portal.example.url/oauth2/callback
  OAUTH2_PROXY_SCOPE: openid profile
  OAUTH2_PROXY_WHITELIST_DOMAINS: keycloak.url
```

Reverse Proxy (Caddy)

```
:8080 {
  map {path} {target_host} {target_port} {
    ~/api/.*  backend   8080

    default   frontend  8080
  }

  reverse_proxy {target_host}:{target_port} {
    header_up Authorization "Bearer {header.X-Forwarded-Access-Token}"
  }
}
```

### Postgres Database

- Choose `user`, `password` and `database` (e.g. `authority_portal`)
- All values are needed later

### Authority Portal - Backend

- Image: `ghcr.io/sovity/authority-portal-backend:v1.0.0`
- Set environment variables according to the following table (mandatory, except log level)

| Variable                                                           | Description                                                                                                 | Example                                            |
|--------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| quarkus.datasource.jdbc.url                                        | Postgres URL                                                                                                | `jdbc:postgres.url://postgres/authority_portal`    |
| quarkus.datasource.username                                        | Postgres user                                                                                               | `postgres`                                         |
| quarkus.datasource.password                                        | Postgres password                                                                                           | `postgres`                                         |
| quarkus.oidc.auth-server-url                                       | Base URL of the OpenID Connect (OIDC) server (Keycloak). Must contain the `/realms/{realm}` part of the URL | `https://keycloak.url/realms/authority-portal`     |
| quarkus.keycloak.admin-client.server-url                           | Keycloak Admin Client: Server URL                                                                           | `https://keycloak.url`                             |
| quarkus.keycloak.admin-client.realm                                | Keycloak Admin Client: Realm                                                                                | `authority-portal`                                 |
| quarkus.keycloak.admin-client.client-id                            | Keycloak Admin Client: Client ID                                                                            | `authority-portal-client`                          |
| quarkus.keycloak.admin-client.client-secret                        | Keycloak Admin Client: Client secret                                                                        | `NKV91vM0KfWeXzaNGaH6fF2z4o01tugl`                 |
| quarkus.keycloak.admin-client.grant-type                           | Keycloak Admin Client: Grant type                                                                           | `CLIENT_CREDENTIALS`                               |
| quarkus.log.level                                                  | Log level for backend logging (user actions, errors, etc.) [Docs](https://quarkus.io/guides/logging)        | `ERROR`, `WARNING`, `INFO` (default), `DEBUG`, ... |
| Following is **one** deployment environment configuration.*        |                                                                                                             |                                                    |
| authority-portal.deployment.environments.test.title                | Env: Title of the deployment environment configuration                                                      | `Test`                                             |
| authority-portal.deployment.environments.test.position             | Env: Order of environments, from 0 (default) to n (least important)                                         | `1`                                                |
| authority-portal.deployment.environments.test.broker.url           | Env: Broker URL                                                                                             | `https://broker.url`                               |
| authority-portal.deployment.environments.test.broker.admin-api-key | Env: Broker Admin API key                                                                                   | `DefaultBrokerServerAdminApiKey`                   |
| authority-portal.deployment.environments.test.broker.api-key       | Env: Broker API key                                                                                         | `ApiKeyDefaultValue`                               |
| authority-portal.deployment.environments.test.daps.url             | Env: DAPS URL                                                                                               | `https://daps.url`                                 |
| authority-portal.deployment.environments.test.daps.realm-name      | Env: DAPS realm name                                                                                        | `DAPS`                                             |
| authority-portal.deployment.environments.test.daps.client-id       | Env: DAPS client ID                                                                                         | `authority-portal`                                 |
| authority-portal.deployment.environments.test.daps.client-secret   | Env: DAPS client secret                                                                                     | `TFzA09w8I6lWM4fbyScZ1qbwO2ejm840`                 |

*Environment `test` is mandatory. Further environments can be configured, but will not be used yet.

### Authority Portal - Frontend

- Image: `ghcr.io/sovity/authority-portal-frontend:v1.0.0`
- Set environment variables according to the following table (mandatory)

| Variable                                                 | Description                                                 | Example                                                                                                                                                                                                                        |
|----------------------------------------------------------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AUTHORITY_PORTAL_FRONTEND_BACKEND_URL                    | Authority Portal Backend URL (most likely same as Frontend) | `https://backend.portal.url`                                                                                                                                                                                                   |
| AUTHORITY_PORTAL_FRONTEND_LOGOUT_URL                     | Auth Proxy: Logout URL**                                    | `https://auth-proxy.url/oauth2/sign_out?rd=https%3A%2F%2Fkeycloak.url%2Frealms%2Fauthority-portal%2Fprotocol%2Fopenid-connect%2Flogout%3Fclient_id%3Doauth2-proxy%26post_logout_redirect_uri%3Dhttps%253A%252F%252Fportal.url` |
| AUTHORITY_PORTAL_FRONTEND_INVALIDATE_SESSION_COOKIES_URL | Auth Proxy: URL to invalidate sessions cookies              | `https://auth-proxy.url/oauth2/sign_out`                                                                                                                                                                                       |

**This should be the URL to signal the Auth Proxy to log out the user. It should contain a redirect URL to the Keycloak logout page, which in turn should contain a redirect URL to the Authority Portal logout page. The redirect URL to the Authority Portal logout page should contain a redirect URL to the Authority Portal base URL/login page. Since both redirect URLs must be encoded a "nested" encoding is necessary. (See example)

## Initial Data

- **First** user that registers at the portal does not need to be approved and will automatically become `Authority Admin`
  - *Meaning this should be done by the MDS team*
- In version 1.0.0, additional users associated with the MDS have to be be created manually as a Keycloak admin, in the Keycloak, by the operator, **after the first user registered**
  1. Create user in Keycloak (Users > Add user)
     - `Required user actions`: None (`Configure OTP` and `Verify Email` should be set automatically after creation)
     - `Username`: Does not matter, but must not be empty (will be overwritten by email)
     - `Email`: Email address of the user
     - `Email verified`: Deactivated
     - `First name`: First name of the user
     - `Last name`: Last name of the user
     - `Join Groups`
       1. Search MDS group (most certainly the only one with an MDS-ID as name), click on ">" (*don't tick the box*) and chose **one** of it's subgroups, to give the user the role of `Participant Admin`, `Participant Curator` or `Participant User`
       2. Either click `Join` and re-open the `Join Groups` window or click on `Groups` to get back to the group overview
       3. Search groups `ROLE_AUTHORITY_ADMIN` and `ROLE_AUTHORITY_USER` and tick **one** of them, to give the user the role of `Authority Admin` or `Authority User`
       4. Click `Join`
       5. (User should now have two groups. One for his role in the MDS organization and one authority role)
  2. Add entry to `user` table in authority portal DB
     ```postgresql
     insert into "user" (id, organization_mds_id, registration_status)
     values ('[Keycloak user ID]', '[MDS-ID of organization]', 'APPROVED');
     ```
     The values for `[Keycloak user ID]` and `[MDS-ID of organization]` can be obtained from Keycloak.
     - `[Keycloak user ID]`: UUID of the user (Users > `[user]` > ID), e.g. `9525c6ea-34d5-4c11-b9f8-133dc2086f00`
     - `[MDS-ID of organization]`: MDS-ID of the user's organization (Users > `[user]` > Groups > Path), e.g. `MDSL1234ZZ`
- To give a user the role of `Service Partner Admin`, the steps are very similar to making a user `Authority Admin` or `Authority User`
  1. Go to a user's group tab (Users > `[user]` > Groups)
  2. Click `Join Group`
  3. Search for `ROLE_SERVICE_PARTNER_ADMIN` and tick the box
  4. Click `Join`
  