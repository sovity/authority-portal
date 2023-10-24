# Changelog

For documentation on how to update this changelog,
please see [changelog_updates.md](docs/dev/changelog_updates.md).

## Unreleased - YYYY-MM-DD

### Overview

Initial Authority Portal MVP Release with a minimalistic feature set.

### Detailed Changes

#### Major

#### Minor

- Added endpoint to invite new participating organizations
  - Provided invitation time stamp in org details
- Added endpoint to invite new users to an organization
- Added endpoints for role changing for authority and participants
- Added endpoints to deactivate users
- Added endpoints to reactivate users
- Unregister own connectors
- Added userId to /api/user-info endpoint
- Added endpoint to retrieve user data
- Added page to invite new users to an existing organization.
- Added endpoint to retrieve organization details

#### Patch

### Deployment Migration Notes

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:{{ release version }}`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:{{ release version }}`
- Broker Server: `{{ broker server version }}`

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
