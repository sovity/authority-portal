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
- Changed the response format for the following endpoints:
  - `POST /api/organizations/my-org/connectors/create-on-premise`
  - `POST /api/organizations/{mds-id}/connectors/create-service-provided`

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
- Authority admins can no longer provide connectors for other organizations

#### Patch

- Start page Iframe won't show if url is not set in the app-config.json

### Deployment Migration Notes

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:{{ version }}`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:{{ version }}`
- Broker Server: `{{ broker version }}`

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
