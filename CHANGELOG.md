# Changelog

For documentation on how to update this changelog,
please see [changelog_updates.md](docs/dev/changelog_updates.md).

## Unreleased - YYYY-MM-DD

### Overview

### Detailed Changes

#### Major

#### Minor

#### Patch

- Fixed "Provided Connectors" view for Service Partners ([#172](https://github.com/sovity/authority-portal/issues/172))
- Fixed red fields in organization create page ([#122](https://github.com/sovity/authority-portal/issues/122))
- Adjusted headers for improved security ([#176](https://github.com/sovity/authority-portal/issues/176))
- Fixed wrong path after onboarding ([#103](https://github.com/sovity/authority-portal/issues/103))
- Fixed yellow inactive sidebar item ([#123](https://github.com/sovity/authority-portal/issues/123))
- Adjusted documentation ([#181](https://github.com/sovity/authority-portal/issues/181))


### Known issues

### Deployment Migration Notes

- Caddy
  - Headers to improve security are now set
  - Modified Caddyfile:
  ```
  # UI Requests: Internet -> Caddy 8080 -> Frontend
  # Backend Requests: Internet -> Caddy 8080 -> Auth Proxy -> Caddy 8081 -> Backend
  
  :8080 {
    map {path} {target_host} {target_port} {
      ~^/api/.*      {$AUTH_PROXY_UPSTREAM_HOST}   8080
      ~^/oauth2/.*   {$AUTH_PROXY_UPSTREAM_HOST}   8080
      default        {$FRONTEND_UPSTREAM_HOST}     8080
    }
  
    reverse_proxy {target_host}:{target_port} {
      header_down -Gap-Auth
    }
  
    # Set security headers for UI responses
    header {
      X-Frame-Options "DENY"
      +Content-Security-Policy "frame-ancestors 'none'"
    }
  
    # Set security headers for API responses
    header /api/* {
      X-Content-Type-Options nosniff
      +Content-Security-Policy "script-src 'none'"
      +Cache-Control "no-store"
    }

    # Set Cache-Control for UI assets
    header /assets/* {
      +Cache-Control "public, max-age=2592000, immutable"
    }
  }
  
  # Caddy 8081 -> Backend
  # We need this second block because the auth proxy
  # does not pass the token on the right header due to
  # kubernetes conventions.
  :8081 {
    reverse_proxy {$BACKEND_UPSTREAM_HOST}:8080 {
      header_up Authorization "Bearer {header.X-Forwarded-Access-Token}"
    }
  }
  ```

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:{{ version }}`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:{{ version }}`
- Broker Server: `{{ broker version }}`

## [v2.2.0] - 20240-04-02

### Overview

This release addresses several issues and adds minor improvements to the Authority Portal.

### Detailed Changes

#### Minor

- Enable users to delete themselves ([#127](https://github.com/sovity/authority-portal/issues/127))
- Added an API endpoint to set the backend log level during runtime: `https://[AP_FQDN]/api/config/log-level?level=[LOG_LEVEL]` ([#2](https://github.com/sovity/authority-portal/issues/2))
  - `x-api-key` header must be set correctly to access this endpoint
  - Example:
  ```bash
  curl -X PUT 'https://authority-portal.example.com/api/config/log-level?level=DEBUG' --header 'x-api-key: uYtR_wNsvXU4EbV9GioACnj!NHML_HRX'
  ```

#### Patch

- Fixed user being able to skip to the final step without submitting in multiple components ([#121](https://github.com/sovity/authority-portal/issues/121))
- Fixed Keycloak notifications, OTP pages ([#146](https://github.com/sovity/authority-portal/issues/146)), ([#151](https://github.com/sovity/authority-portal/issues/151))
- Fixed provided connectors' statuses missing on the dashboard ([#138](https://github.com/sovity/authority-portal/issues/138))
- Fixed "Hosted By Name" column in Connector CSV report ([#149](https://github.com/sovity/authority-portal/issues/149))
- Fixed wrong Users and Roles path [#150](https://github.com/sovity/authority-portal/issues/150)
- Fixed phone number and description validators ([#161](https://github.com/sovity/authority-portal/issues/161))
- Fixed Page not found for "MyUsers" route ([#163](https://github.com/sovity/authority-portal/issues/163))
- Fixed logo in Keycloak Theme being cut off ([#165](https://github.com/sovity/authority-portal/issues/165))
- Fixed wording in "Reset Password" email ([#116](https://github.com/sovity/authority-portal/issues/116))
- Fixed wording in "Provide Central Component" form ([#112](https://github.com/sovity/authority-portal/issues/112))
- Adjusted wording in the sidebar menu ([#117](https://github.com/sovity/authority-portal/issues/117))
- Adjusted documentation ([#159](https://github.com/sovity/authority-portal/issues/159))

### Deployment Migration Notes

- Portal Backend
  - Environment variables
  ```yaml
  # Added
  # API key to protect config endpoints, like /api/config/log-level
  authority-portal.config.api-key: [API_KEY]
  ```
- Auth Proxy
  - Environment variables
  ```yaml
  # Changed
  OAUTH2_PROXY_SKIP_AUTH_ROUTES: "^(/oauth2|/api/registration|/api/config)"
  ```
- Keycloak
  - Replace [MDS theme](authority-portal-keycloak/mds-theme) with the new version

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:2.2.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:2.2.0`
- Broker Server: [`4.1.0`](https://github.com/sovity/edc-broker-server-extension/releases/tag/v4.1.0)

## [v2.1.2] - 2024-03-22

### Overview

This release addresses several issues and adds minor improvements to the Authority Portal.

### Detailed Changes

#### Patch

- Fixed the placeholder for the connector Frontend URL ([#86](https://github.com/sovity/authority-portal/issues/86))
- Fixed connectors not showing on operator's "All connectors" list ([#119](https://github.com/sovity/authority-portal/issues/119))
- Fixed an issue with connector URLs not being validated correctly in the UI ([#115](https://github.com/sovity/authority-portal/issues/115))
- Fixed MDS logo & footer (in compact view) ([#57](https://github.com/sovity/authority-portal/issues/57))
- Fixed text overlapping on fullscreen pages ([#80](https://github.com/sovity/authority-portal/issues/80))
- Fixed text overlapping in the registration form ([#120](https://github.com/sovity/authority-portal/issues/120))
- Fixed an issue where clicking "back to application" on the logout confirmation page would not properly cancel the logout process ([#8](https://github.com/sovity/authority-portal/issues/8))
- Fixed an issue where clicking "Data Offers" without having a registered connector would redirect the user to a wrong page ([#44](https://github.com/sovity/authority-portal/issues/44))
- Fixed an issue where an error would be displayed during login under certain circumstances ([#107](https://github.com/sovity/authority-portal/issues/107))
- Fixed an issue where deleting the last user of an organization would delete the organization but leave the user in an invalid state ([#45](https://github.com/sovity/authority-portal/issues/45))
- Fixed the dashboard for non-authority users ([#118](https://github.com/sovity/authority-portal/issues/118))
- Dashboard: Changed the component uptime duration to be shown next to the status instead of showing it in a tooltip ([#62](https://github.com/sovity/authority-portal/issues/62))
- Changed the Keycloak custom theme for login and logout pages [#113](https://github.com/sovity/authority-portal/issues/113)
- Changed the Keycloak realm ID to `mds-portal` ([#139](https://github.com/sovity/authority-portal/issues/139))
- Changed the Access Token Lifespan to one minute ([#111](https://github.com/sovity/authority-portal/issues/111))
- Changed error messages on the registration form to be more user-friendly ([#106](https://github.com/sovity/authority-portal/issues/106))
- Updated user documentation to reflect the current version ([#5](https://github.com/sovity/authority-portal/issues/5))
- Added legal notices to the login page ([#79](https://github.com/sovity/authority-portal/issues/79))
- Added tooltips explaining user roles ([#76](https://github.com/sovity/authority-portal/issues/76))

### Known issues

- Due to the change of the Keycloak realm name, some auth-related URLs might be outdated in your browser. If you run into this issue. please clear your browser cache and hard-reload the page.
- Login and first-login related Keycloak pages may look broken. This will be fixed in the next release.

### Deployment Migration Notes

- Keycloak
  - Change realm ID and name
    - Realm settings > General > Realm ID: `mds-portal`
    - Realm settings > General > Display name: `MDS Portal`
  - Change the configuration for the oauth2-proxy client
    - Clients > oauth2-proxy > Settings > Home URL: `/oauth2/sign_in`
  - Set Access Token Lifespan to 1 minute (Realm Settings -> Tokens -> Access Token Lifespan)
  - Replace [MDS theme](authority-portal-keycloak/mds-theme) with the new version
- Auth Proxy
  - Copy the contents from [resources](authority-portal-oauth2-proxy/resources) to a directory the OAuth2 proxy can access (`CUSTOM_TEMPLATES_DIR`)
  - Environment variables
    ```yaml
    # Changed
    OAUTH2_PROXY_OIDC_ISSUER_URL: https://[KC_FQDN]/realms/mds-portal
    OAUTH2_PROXY_COOKIE_REFRESH: 30s
    OAUTH2_PROXY_CUSTOM_TEMPLATES_DIR: [CUSTOM_TEMPLATES_DIR]
    ```
- Portal Backend
  - Environment variables
    ```yaml
    # Changed
    # Base URL of the OIDC server (Keycloak). Must contain the '/realms/{realm}' part of the URL
    quarkus.oidc.auth-server-url: https://[KC_FQDN]/realms/mds-portal
    # Keycloak Admin Client: Realm
    quarkus.keycloak.admin-client.realm: mds-portal
    ```
- Portal Frontend
  - Environment variables
    ```yaml
    # Changed
    # Auth Proxy: Logout URL (please replace ALL placeholders: [EXAMPLE])
    AUTHORITY_PORTAL_FRONTEND_LOGOUT_URL: https://[AP_FQDN]/oauth2/sign_out?rd=https%3A%2F%2F[KC_FQDN]%2Frealms%2Fmds-portal%2Fprotocol%2Fopenid-connect%2Flogout%3Fclient_id%3Doauth2-proxy%26post_logout_redirect_uri%3Dhttps%253A%252F%252F[AP_FQDN]
    ```

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:2.1.2`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:2.1.2`
- Broker Server: [`4.0.0`](https://github.com/sovity/edc-broker-server-extension/releases/tag/v4.0.0)

## [v2.1.1] - 2024-03-14

### Overview

First bugfix release for version 2.1.0.

### Detailed Changes

#### Patch

- Fixed the dashboard not reloading when switching deployment environments
- Fixed an error with input validation that prevented the use of upper-case letters in zip codes ([#21](https://github.com/sovity/authority-portal/issues/21))
- Fixed an error with provisioning CaaS breaking the dashboard ([#27](https://github.com/sovity/authority-portal/issues/27))
- Fixed the text being cut off in the connector self-hosting instructions ([#97](https://github.com/sovity/authority-portal/issues/97))
- Fixed inconsistent placeholder values for privacy policy and legal notice links ([#41](https://github.com/sovity/authority-portal/issues/41))
- Fixed favicon and page titles being not aligned with breadcrumbs ([[#48](https://github.com/sovity/authority-portal/issues/48)])
- Fixed misleading UptimeKuma endpoint documentation ([#96](https://github.com/sovity/authority-portal/issues/96))
- Fixed components being displayed as online when UptimeKuma is unreachable
- Fixed Authority Users not being able to invite participants ([#65](https://github.com/sovity/authority-portal/issues/65))
- Fixed the organization address being displayed incorrectly ([#101](https://github.com/sovity/authority-portal/issues/101))
- Fixed styling, removed hover effect on unclickable avatar components ([#99](https://github.com/sovity/authority-portal/issues/99))
- Fixed the display of user roles missing spaces between words ([#100](https://github.com/sovity/authority-portal/issues/100))
- Fixed certificate generation failing when using special characters ([#84](https://github.com/sovity/authority-portal/issues/84))
- Changed the order of industry select options ([#22](https://github.com/sovity/authority-portal/issues/22))
- Changed the logo to redirect to MDS home ([#64](https://github.com/sovity/authority-portal/issues/64))
- Changed the wording of the reset password functionality ([#51](https://github.com/sovity/authority-portal/issues/51))
- Renamed "All Data Offers" to "Data Catalogue" ([#52](https://github.com/sovity/authority-portal/issues/52))
- Adjusted the ordering of users in the organization details page ([#98](https://github.com/sovity/authority-portal/issues/98))
- Adjusted the ordering of organizations in the organization overview page ([#49](https://github.com/sovity/authority-portal/issues/49))
- Added a character limit to most input fields (128 characters) ([#17](https://github.com/sovity/authority-portal/issues/17))
- Added missing variables to show "hide/show" icon in reset password keycloak page ([#93](https://github.com/sovity/authority-portal/issues/93))
- Added a notification when the user clicks on a copy button ([#24](https://github.com/sovity/authority-portal/issues/24))
- Added asterisks to highlight required fields on registration ([#7](https://github.com/sovity/authority-portal/issues/7))
- Certificate generation: Added a notice below the generate button ([#94](https://github.com/sovity/authority-portal/issues/94))
- Removed "Control Center" from breadcrumb path to improve UX ([#54](https://github.com/sovity/authority-portal/issues/54))
- Restricted user re-/deactivation to appropriate statuses ([#82](https://github.com/sovity/authority-portal/issues/82))
- Cleaned up the repository for open-source release:
  - Removed internal tools and utilities
  - Rebased the entire history to remove secrets and unrelated code
  - Cleaned up dead links
  - Adjusted the release issue template

### Known issues

### Deployment Migration Notes

- Keycloak
  - Replace [MDS theme](authority-portal-keycloak/mds-theme) with the new version

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:2.1.1`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:2.1.1`
- Broker Server: [`3.5.0`](https://github.com/sovity/edc-broker-server-extension/releases/tag/v3.5.0)

## [v2.1.0] - 2024-03-04

### Overview

Final feature release for the first Go-Live of the MDS.

### Detailed Changes

#### Minor

- Dashboard Page: Component Status Overview
- Dashboard Page: Connector Status Overview
- Dashboard Page: CSV Reports: Connectors, Users, Data Offers, System Stability
- Control Center: Edit Own Organization Details Page
- Control Center: Edit Own User Details Page
- Improved User Profiles slightly by reordering items
- Improved Organization Profiles slightly by reordering items
- Organization field "industry" was added
- Organization field "business unit" is now mandatory
- Renamed `MDS Authority Portal` occurrences to `MDS Portal`
- Footer: Added Legal Notice link
- Footer: Added Copyright Notice

#### Patch

- Improved Menus and Navigation
- Improved User Profiles by reordering items, icons and showing more information
- Improved Organization Profiles slightly by reordering items, icons and showing more information
- Improved Connector Detail Pages slightly by reordering items, icons and showing more information
- Some pages, that did not have the footer before, have it now
- User Onboarding: Fix Privacy Policy Check not positioned correctly
- Organization Onboarding: Fix approve/reject buttons showing when organization is still invited or onboarding
- Multiple layouting, responsiveness and styling fixes
- Fix: 404 page not working
- Changed the CaaS curator from the organization's main contact to the user requesting the CaaS

### Known issues

### Deployment Migration Notes

- Portal Frontend
  - Environment Variables
    ```yaml
    # Added
    # Authority Portal Legal Notice URL
    AUTHORITY_PORTAL_FRONTEND_LEGAL_NOTICE_URL: https://mobility-dataspace.eu/legal-notice
    ```

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:2.1.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:2.1.0`
- Broker: [`3.5.0`](https://github.com/sovity/edc-broker-server-extension/releases/tag/v3.5.0)

## [v2.0.0] - 2024-02-27

### Overview

Major release, containing a UI rework and several new features.

### Detailed Changes

#### Major

- Redesigned the entire Portal UI
  - Redesigned connector overview pages
  - Added detail panes for connectors, organizations & users
  - Redesigned registration and onboarding processes for organizations & users
  - Added a new "unauthenticated page", registration now happens in the Authority Portal without Keycloak.
  - Redesigned authority participant management Section
  - Redesigned the landing page to display information provided by MDS
- Added a feature to request a Connector-as-a-Service from the sovity portal
- Upgraded Keycloak to version 23.0.4

#### Minor

- Users are now able to edit their information
- Organization admins can now edit their organization's information
- Updated processes to be compatible with the new Broker API
- Changed the connector registration flow
  - Registration now fails when attempting to use a certificate that is already in use
  - Registration no longer fails when an error occurs while registering it to the Broker
  - Connectors now regularly try to re-register to Broker if previous attempts failed
  - Connector URLs can now be configured independently
- Updated the organization member list to display more details
- Connector status is now displayed in real-time
- Added the ability for organization & authority admins to delete users
- Added a link to own organization's data offers in the sidebar
- Renamed participant roles:
  - Participant Admin -> Admin
  - Participant Curator -> Key User
  - Participant User -> User
- Operator admins can now access an overview of all connectors and have the ability to delete them
- Privacy policy link is now displayed on all pages and required to be accepted during registration flows
- Updated catalog link to redirect to the correct broker url based on environment
- Improved displaying of the user roles
- Now showing registration status in organization user details title bar

#### Patch

- Roles of invited users are now set correctly
- Fixed displaying of long organization titles in detail view

### Known issues

### Deployment Migration Notes

- Keycloak
  - Replace [MDS theme](authority-portal-keycloak/mds-theme) with the new version
  - Keycloak IAM needs to be upgraded to version 23.0.4

- Portal Backend
  - Added environment variables
    ```yaml
    # CaaS Portal API Client Auth
    # will be provided by sovity
    quarkus.oidc-client.sovity.auth-server-url: https://[CAAS_KC_FQDN]/realms/[REALM]
    quarkus.oidc-client.sovity.client-id: [CAAS_CLIENT_ID]
    quarkus.oidc-client.sovity.credentials.secret: [CAAS_CLIENT_SECRET]
    # CaaS Portal URL
    authority-portal.caas.sovity.url: https://[CAAS_PORTAL_FQDN]

    # CaaS Limit: Amount of free sovity CaaS per participant
    authority-portal.caas.sovity.limit-per-mdsid: 1

    # Uptime Kuma Configuration
    authority-portal.kuma.metrics-url: https://[UPTIME_KUMA_FQDN]
    authority-portal.kuma.api-key: [UPTIME_KUMA_API_KEY]
    # Description of a component in Uptime Kuma (ENVIRONMENT: test, prod, etc.; COMPONENT: broker, daps, logging-house)
    authority-portal.deployment.environments.{ENVIRONMENT}.{COMPONENT}.kuma-name:
      [KUMA_NAME]

    # Logging House URL (ENVIRONMENT: test, prod, etc.)
    authority-portal.deployment.environments.{ENVIRONMENT}.logging-house.url: https://[LOGGING_HOUSE_FQDN]
    ```

  - Removed environment variables
    - ~~`authority-portal.connectors.url.frontend`~~
    - ~~`authority-portal.connectors.url.management`~~
    - ~~`authority-portal.connectors.url.endpoint`~~

- Portal Frontend
  - Added environment variables
    ```yaml
    # Auth Proxy: Login URL (with redirect to the Authority Portal)
    AUTHORITY_PORTAL_FRONTEND_LOGIN_URL: https://[AP_FQDN]/oauth2/start?rd=https%3A%2F%2F[AP_FQDN]
    # MDS Dashboard iFrame URL
    AUTHORITY_PORTAL_FRONTEND_IFRAME_URL: https://mobility-dataspa-5n9px2qi7r.live-website.com/mds-news
    # MDS Privacy Policy URL
    AUTHORITY_PORTAL_FRONTEND_PRIVACY_POLICY_URL: https://mobility-dataspace.online/privacy-policy-mds-portal
    ```
- Connectors now have configurable URLs for the Frontend, Endpoint and Management API. Please check existing connectors for their correct URLs. If needed, remove affected connectors and re-register them with a correct URL configuration.

- The infrastructure was changed in a way that the Portal Frontend is now publicly reachable to enable participant self-registration.
  - UI Requests: Internet -> Caddy 8080 -> Frontend
  - Backend Requests: Internet -> Caddy 8080 -> Auth Proxy -> Caddy 8081 -> Backend
- Caddy

  - The Caddy configuration needs to be updated, as it now serves as the **main entry point for the Authority Portal**.
  - Added environment variable `OAUTH_PROXY_UPSTREAM_HOST: [Auth Proxy service]`
  - Modified Caddyfile

    - Configuration for `:8080`

      ```
      :8080 {
        map {path} {target_host} {target_port} {
          ~^/api/.*      {$AUTH_PROXY_UPSTREAM_HOST}   8080
          ~^/oauth2/.*   {$AUTH_PROXY_UPSTREAM_HOST}   8080
          default        {$FRONTEND_UPSTREAM_HOST}     8080
        }

        reverse_proxy {target_host}:{target_port}
      }
      ```

    - Configuration for `:8081`
      ```
      :8081 {
          reverse_proxy {$BACKEND_UPSTREAM_HOST}:8080 {
              header_up Authorization "Bearer {header.X-Forwarded-Access-Token}"
          }
      }
      ```
    - The productive deployment guide contains the full file.

- Auth Proxy

  - Environment variables

    ```yaml
    # Added
    OAUTH2_PROXY_API_ROUTES: "^/api/"

    # Changed
    OAUTH2_PROXY_UPSTREAMS: http://[Caddy service]:8081/
    OAUTH2_PROXY_SKIP_AUTH_ROUTES: "^(/oauth2|/api/registration)"
    ```

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:2.0.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:2.0.0`
- Broker Server: `3.4.0`

## [v0.3.3] - 2024-02-15

### Overview

Bug- and styling fixes. Also fixes the user documentation.

### Detailed Changes

#### Patch

**Bugfixes**

- Remove existing OTP configurations when resetting a user's password

**Styling**

- Changed wording on connector registration pages and added additional information regarding URL configuration
- Changed wording on the landing page for rejected users
- Fixed registration page responsiveness

**Documentation**

- Adjusted user documentation to fit the current version of the component

### Known issues

- After logout, if the user leaves the login page and returns to the "previous" login page using the browser's back button, an error will be displayed upon a login attempt. The user can still log in using the appropriate button displayed on the error page

### Deployment Migration Notes

- Keycloak IAM
  - Set OTP reset policy to "Remove all" (Authentication -> Flows -> reset credentials -> Reset OTP -> Gear Icon)
  - To temporarily disable self-registration of participants go to: Realm Settings -> Login -> User Registration (deactivate switch)

_For further information check out our [Productive Deployment Guide](README.md#productive-deployment-guide)._

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.3.3`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.3.3`
- Broker Server: `3.3.0`

## [v0.3.2] - 2024-01-26

### Overview

Added overview of all registered connectors in the Authority Section and fixed several bugs.

### Detailed Changes

#### Patch

**Bugfixes**

- Fixed an issue where the user could register multiple connectors with identical data
- Fixed an issue where the user could still access the portal after logout
- Fixed an issue where rejected users would be shown a blank screen
- Service partners can now provide connectors again
- Addressed security issues
  - Updated dependencies
  - Upgraded Keycloak to version 22.0.2

**Other**

- Added an overview of all registered connectors in the Authority Section

**Documentation**

- Moved some lines in the [Productive Deployment Guide](README.md#productive-deployment-guide) to the correct location

### Known issues

- After logout, if the user leaves the login page and returns to the "previous" login page using the browser's back button, an error will be displayed upon a login attempt. The user can still log in using the appropriate button displayed on the error page

### Deployment Migration Notes

- Keycloak IAM needs to be upgraded to version 22.0.2

_For further information check out our [Productive Deployment Guide](README.md#productive-deployment-guide)._

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.3.2`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.3.2`
- Broker Server: `3.2.0`

## [v0.3.1] - 2024-01-22

### Overview

### Detailed Changes

Patch Release for DB migrations.

#### Patch

- Fixed an issue with DB migrations, causing deployments on older DB states to fail
- Fixed an issue where rejected users getting to be redirected to blank screen

### Deployment Migration Notes

_For further information check out our [Productive Deployment Guide](README.md#productive-deployment-guide)._

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.3.1`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.3.1`
- Broker Server: `3.2.0`

## [v0.3.0] - 2024-01-19

### Overview

Added central component management, fixed multiple bugs and pushing organization metadata to Broker.

### Detailed Changes

#### Minor

- Operator Admins can now manage central dataspace components and add them to the DAPS
- Now pushing organization metadata to MDS Brokers (Dependency from Broker development)
- Removed the ability to provide connectors for Authority roles
- Improved the invitation & confirmation e-mail templates
- Added product documentation: Registration processes, roles and rights, user onboarding

#### Patch

**Bugfixes**

- Fixed an issue with the environment switcher
- Fixed an issue where users could not be re-invited after failing to confirm their registration in time
- Fixed Connector URLs not being validated
- Fixed an issue where the user got stuck in Keycloak after registration/login
- Fixed an issue where the scroll bar would not appear

**Styling**

- Reworded texts on landing page

### Deployment Migration Notes

- Portal Backend
  - Added an environment variable `authority-portal.invitation.expiration: 43200`
  - Added an environment variable `authority-portal.base-url: https://authority-portal.my-org.com`
  - The `authority-portal-client` in Keycloak needs to be updated with new configuration
    - Root URL: same as the environment variable `authority-portal.base-url`
    - Home URL: same as the root URL
- Keycloak
  - Replace [MDS theme](authority-portal-keycloak/mds-theme) with new version
  - Select new email template (Realm Settings -> Themes -> Email theme)

_For further information check out our [Productive Deployment Guide](README.md#productive-deployment-guide)._

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.3.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.3.0`
- Broker Server: `3.2.0`

## [v0.2.1] - 2024-01-09

### Overview

Patch release, regarding bugfixes and styling issues.

### Detailed Changes

#### Patch

**Bugfixes**

- Fix role management system (Application roles)
- Include subject and authority key identifier in generated certificates
- Sign certificates with SHA256 instead of default SHA1
- Fixed URL mapping for broker interactions
- Fix bug during connector deletion

**Styling**

- Split address field into street, house no., zip and city during organization registration
- Changed links to legal documents to english versions

### Deployment Migration Notes

- Portal Backend
  - Add environment variable `authority-portal.connectors.url.frontend: /`
  - Add environment variable `authority-portal.connectors.url.management: /api/management`
  - Add environment variable `authority-portal.connectors.url.endpoint: /api/dsp`

_For further information check out our [Productive Deployment Guide](README.md#productive-deployment-guide)._

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.2.1`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.2.1`
- Broker Server: `3.1.0`

## [v0.2.0] - 2023-12-18

### Overview

Reworked initial deployment guide, fixed many bugs and styling issues.

### Detailed Changes

#### Minor

- Added a health check endpoint `backend:8080/q/health`
- Updated Connector form to generate self-signed certificates instead of key pairs

#### Patch

**Bugfixes**

- Hardened the first user registration to prevent duplicate users
- Hardened user invitation to prevent duplicate users
- Fixed the registration form not showing validation messages.
- Fixed a bug causing white screens on session expiration
- Fixed a bug causing errors on logout
- Fixed "Remember me" not working
- Fixed an issue with updating user roles
- Fixed calculation of the highest user role, shown below the username in the sidebar
- Fixed a bug where users can submit Organization profile without confirming they are eligible to create profile
- Refactored breadcrumbs to distinguish between clickable and non-clickable steps

**Styling**

- Made Inter and Material Icon Fonts locally available
- Redesigned the footer section
- Fixed an issue with sidebar elements getting cropped out
- Fixed cursor design, when hovering over items that are not clickable
- Improved mobile responsiveness on login and registration page
- Fixed styling issues on the OTP verification form page
- Binding username issue on user profile page fixed
- Updated overall Keycloak theme styling misalignment
- Replaced "Registered On" by "Created On" at the user profile page

**Documentation**

- Added an internal dev deployment to Sirius with E2E tests for automated set-up.
- Reworked Initial Productive Deployment Guide that further materializes the interactions with the Auth Proxy.

### Deployment Migration Notes

- Please check out the reworked [Initial Deployment Guide](README.md#productive-deployment-guide).
  - Please check if everything is configured as intended.
- Keycloak
  - Replace [MDS theme](authority-portal-keycloak/mds-theme) with new version
  - Add "Remember me" settings (Realm settings > Sessions)
    - SSO Session Idle Remember Me: `7 days`
    - SSO Session Max Remember Me: `7 days`
- OAuth2 Proxy
  - Add environment variable `OAUTH2_PROXY_COOKIE_REFRESH: 4m` (Access Token Lifespan - 1 minute)
  - Add environment variable `OAUTH2_PROXY_COOKIE_EXPIRE: 30m` (Client Session Idle / SSO Session Idle)

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.2.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.2.0`
- Broker Server: `3.1.0`

## [v0.1.2] - 2023-12-08

### Overview

Patch release for EDC 0.2.x Broker.

#### Patch

- Adjusted Broker URL for Broker version `3.1.0`

### Deployment Migration Notes

_No special migration steps required._

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.1.2`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.1.2`
- Broker Server: `3.1.0`

## [v0.1.1] - 2023-11-09

### Overview

Patch release, adding missing buttons.

### Detailed Changes

#### Patch

- Added button for user de-/reactivation on the user details page
- Added button for user invitation on the organization details page

### Deployment Migration Notes

- Upgrade Authority Portal to this version
  - Shut down current version
  - Restart with new images

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.1.1`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.1.1`
- Broker Server: `1.2.0`

## [v0.1.0] - 2023-10-31

### Overview

Second Authority Portal MVP Release, providing extended features, mainly to enable participant management.

### Detailed Changes

#### Major

- Added invitation of new participating organizations
- Added invitation of new users to an organization (Frontend missing)
- Added user deactivation (Frontend missing)
- Added support for multiple deployment environments

#### Minor

- Added possibility to change user roles
- Added unregistering of own (company intern) connectors
- Updated organization detail page to show statistics for Authority Admins
- Updated organization detail page to show more information (including user list)
- Added user detail pages
- Added possibility to generate a connector certificate in browser
- Added button with link to the invite new users page

### Deployment Migration Notes

- Upgrade Broker to version 1.2.0
- Upgrade Authority Portal to this version
  - Shut down current version
  - Restart with new images

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.1.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.1.0`
- Broker Server: `1.2.0`

## [v1.0.0] - 2023-09-29

### Overview

Initial Authority Portal MVP Release with a minimalistic feature set.

> [!IMPORTANT]
> The versioning scheme was changed after this release, so semantically this version is equivalent to a `v0.0.1`.

### Detailed Changes

#### Major

- Implemented an Authority Portal MVP
  - User registration process via Keycloak
  - Organization registration process
  - Organization review process
  - Connector registration for own and other organization(s)
  - Roles and respective permissions
    - Authority Admin
    - Authority User
    - Participant Admin
    - Participant Curator
    - Participant User
    - Service Partner Admin
    - Operator Admin (not yet used)

### Deployment Migration Notes

Please view the [Deployment Section in the README.md](README.md#deployment) for initial deployment instructions.

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:1.0.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:1.0.0`
