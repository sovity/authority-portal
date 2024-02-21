# Changelog

For documentation on how to update this changelog,
please see [changelog_updates.md](docs/dev/changelog_updates.md).

## Unreleased - YYYY-MM-DD

### Overview

### Detailed Changes

#### Major

- Redesigned Connectors list, detail and related sub-pages
- Redesigned Portal Sidebar, Header and other general layouts
- Moved registration process from Keycloak into the portal
- Upgraded Keycloak dependency to version 23.0.4
- Redesigned authority participant management Section
- Added the option to request a Connector-as-a-Service from the sovity portal
- Streamlined invitation & registration process

#### Minor

- Redesigned Portal Sidebar, Header and other general layouts
- Added an IFrame for MDS on the start page
- Added possibility to download own organization connectors as csv
- Added possibility to download connectors as csv
- Changed font from Inter to Arial
- Added possibility to update user details
- Added possibility to update organization details
- Added possibility to download user details as csv
- Adapted to new Broker API
- Connector registration now fails when attempting to use a certificate that is already in use
- Connector registration no longer fails when an error occurs while registering it to the Broker
- Connectors now regularly try to re-register to Broker if previous attempts failed
- User details in the organization member list can now show more details
- Authority admins can no longer provide connectors for other organizations
- Backend: Sync organization data to MDS Broker(s) (Dependency from Broker development)
- Removed Provide Connector Feature
- Changed Connector URL persistence. Frontend URL, Endpoint URL and Management API URL are now independent of each other
- slide-overs scrolling issue has been fixed
- Added a connector overview for service providers and the option to unregister provided connectors
- Connector status is now fetched from Broker and sovity portal and periodically updated
- Added CaaS connector deletion consequences to confirmation dialog
- Re-branded Participant organization and user Invitation pages
- Re-branded Invited User and Organization onboarding pages
- Added connector status to list and detail views
- Added Environment switcher to the topbar
- Implemented CaaS integration
- Enforced limits for free CaaS requests
- Added accept TOS checkbox to registration form
- New "unauthenticated page", registration now happens in the Authority Portal without Keycloak.
- Made connectors URL fields clickable/copyable in detail view
- Added link that opens frontend in new tab to connector list view
- Updated the form validators and validation system
- Added the possibility to delete users
- Added own data offers link to sidebar
- Added the possibility for users to change their user data including the email address

#### Patch

- Start page Iframe won't show if url is not set in the app-config.json
- Issue with Env selector not updating while creating connector is fixed

### Known issues

- After logout, if the user leaves the login page and returns to the "previous" login page using the browser's back button, an error will be displayed upon a login attempt. The user can still log in using the appropriate button displayed on the error page

### Deployment Migration Notes

- Keycloak IAM needs to be upgraded to version 23.0.4
- Portal Backend
  - Added environment variables
    - `quarkus.oidc-client.sovity.client-id: https://[CAAS_KC_FQDN]/realms/[REALM`
    - `quarkus-oidc-client.sovity.auth-server.url: [CLIENT_ID]`
    - `quarkus-oidc-client.sovity.credentials.secret: [CAAS_CLIENT_SECRET]`
    - `authority-portal.caas.sovity.url: https://[CAAS_PORTAL_FQDN]`
    - `authority.portal.caas.sovity.limit-per-mdsid: 1`
    - `authority-portal.deployment.environments.{ENVIRONMENT}.logging-house.url: https://[LOGGING_HOUSE_FQDN]`
  - Removed environment variables
    - `authority-portal.connectors.url.frontend`
    - `authority-portal.connectors.url.management`
    - `authority-portal.connectors.url.endpoint`
    - Please ensure that the frontend, endpoint and management API URLs are configured correctly for all connectors. If needed, remove affected connectors and re-register them with a correct URL configuration.
- Portal Frontend
  - Added environment variable `AUTHORITY_PORTAL_FRONTEND_DSGVO_URL`
  - Added environment variable `AUTHORITY_PORTAL_FRONTEND_AVV_URL`

- TODO: Create Deployment Migration Notes for the new Self-Registration flow

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:{{ version }}`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:{{ version }}`
- Broker Server: `{{ broker version }}`

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

- Fixed an issue where the user could register multiple connectors with identical data (closes [#407](https://github.com/sovity/authority-portal/issues/407))
- Fixed an issue where the user could still access the portal after logout (closes [#425](https://github.com/sovity/authority-portal/issues/425))
- Fixed an issue where rejected users would be shown a blank screen (closes [#562](https://github.com/sovity/authority-portal/pull/562))
- Service partners can now provide connectors again (closes [#587](https://github.com/sovity/authority-portal/issues/587))
- Addressed security issues
  - Updated dependencies
  - Upgraded Keycloak to version 22.0.2

**Other**

- Added an overview of all registered connectors in the Authority Section (closes [581](https://github.com/sovity/authority-portal/issues/581))

**Documentation**

- Moved some lines in the [Productive Deployment Guide](README.md#productive-deployment-guide) to the correct location (closes [#580](https://github.com/sovity/authority-portal/issues/580))

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

- Operator Admins can now manage central dataspace components and add them to the DAPS (closes [#334](https://github.com/sovity/authority-portal/issues/334) & [#403](https://github.com/sovity/authority-portal/issues/403))
- Now pushing organization metadata to MDS Brokers (Dependency from Broker development)
- Removed the ability to provide connectors for Authority roles (closes [#390](https://github.com/sovity/authority-portal/issues/390))
- Improved the invitation & confirmation e-mail templates (closes [#241](https://github.com/sovity/authority-portal/issues/241) & [#331](https://github.com/sovity/authority-portal/issues/331))
- Added product documentation: Registration processes, roles and rights, user onboarding

#### Patch

**Bugfixes**

- Fixed an issue with the environment switcher (closes [#361](https://github.com/sovity/authority-portal/issues/361))
- Fixed an issue where users could not be re-invited after failing to confirm their registration in time (closes [#423](https://github.com/sovity/authority-portal/issues/423))
- Fixed Connector URLs not being validated (closes [#442](https://github.com/sovity/authority-portal/issues/442))
- Fixed an issue where the user got stuck in Keycloak after registration/login (closes [#424](https://github.com/sovity/authority-portal/issues/424))
- Fixed an issue where the scroll bar would not appear (closes [#440](https://github.com/sovity/authority-portal/issues/440))

**Styling**

- Reworded texts on landing page (closes [#535](https://github.com/sovity/authority-portal/issues/535))

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
- Include subject and authority key identifier in generated certificates (closes [#400](https://github.com/sovity/authority-portal/issues/400))
- Sign certificates with SHA256 instead of default SHA1
- Fixed URL mapping for broker interactions (closes [#303](https://github.com/sovity/authority-portal/issues/303))
- Fix bug during connector deletion

**Styling**

- Split address field into street, house no., zip and city during organization registration (closes [#406](https://github.com/sovity/authority-portal/issues/406))
- Changed links to legal documents to english versions (closes [#269](https://github.com/sovity/authority-portal/issues/269))

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

- Added a health check endpoint `backend:8080/q/health` (closes [#318](https://github.com/sovity/authority-portal/issues/318))
- Updated Connector form to generate self-signed certificates instead of key pairs (closes [#275](https://github.com/sovity/authority-portal/issues/275))

#### Patch

**Bugfixes**

- Hardened the first user registration to prevent duplicate users (closes [#311](https://github.com/sovity/authority-portal/issues/311))
- Hardened user invitation to prevent duplicate users (closes [#311](https://github.com/sovity/authority-portal/issues/311))
- Fixed the registration form not showing validation messages. (closes [#311](https://github.com/sovity/authority-portal/issues/311))
- Fixed a bug causing white screens on session expiration (closes [#251](https://github.com/sovity/authority-portal/issues/251), [#237](https://github.com/sovity/authority-portal/issues/237))
- Fixed a bug causing errors on logout (closes [#237](https://github.com/sovity/authority-portal/issues/237))
- Fixed "Remember me" not working (closes [#258](https://github.com/sovity/authority-portal/issues/258))
- Fixed an issue with updating user roles (closes [#327](https://github.com/sovity/authority-portal/issues/327))
- Fixed calculation of the highest user role, shown below the username in the sidebar (closes [#326](https://github.com/sovity/authority-portal/issues/326))
- Fixed a bug where users can submit Organization profile without confirming they are eligible to create profile (closes [#374](https://github.com/sovity/authority-portal/issues/374))
- Refactored breadcrumbs to distinguish between clickable and non-clickable steps (closes [#369](https://github.com/sovity/authority-portal/issues/369))

**Styling**

- Made Inter and Material Icon Fonts locally available (closes [#320](https://github.com/sovity/authority-portal/issues/320))
- Redesigned the footer section (closes [#257](https://github.com/sovity/authority-portal/issues/257))
- Fixed an issue with sidebar elements getting cropped out (closes [#252](https://github.com/sovity/authority-portal/issues/252))
- Fixed cursor design, when hovering over items that are not clickable (closes [#256](https://github.com/sovity/authority-portal/issues/256))
- Improved mobile responsiveness on login and registration page (closes [#369](https://github.com/sovity/authority-portal/issues/369))
- Fixed styling issues on the OTP verification form page (closes [#259](https://github.com/sovity/authority-portal/issues/259))
- Binding username issue on user profile page fixed (closes [#336](https://github.com/sovity/authority-portal/issues/336))
- Updated overall Keycloak theme styling misalignment (closes [#369](https://github.com/sovity/authority-portal/issues/369), [#254](https://github.com/sovity/authority-portal/issues/254), [#259](https://github.com/sovity/authority-portal/issues/259))
- Replaced "Registered On" by "Created On" at the user profile page (closes [#332](https://github.com/sovity/authority-portal/issues/332))

**Documentation**

- Added an internal dev deployment to Sirius with E2E tests for automated set-up. (closes [#290](https://github.com/sovity/authority-portal/issues/290))
- Reworked Initial Productive Deployment Guide that further materializes the interactions with the Auth Proxy. (done by [#364](https://github.com/sovity/authority-portal/pull/364))

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
