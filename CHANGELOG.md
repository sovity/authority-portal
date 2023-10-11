# Changelog

For documentation on how to update this changelog, 
please see [changelog_updates.md](docs/dev/changelog_updates.md).

## Unreleased - YYYY-MM-DD

### Overview

Initial Authority Portal MVP Release with a minimalistic feature set.

### Detailed Changes

#### Major

#### Minor

- Add endpoint to invite new participating organizations
  - Provide invitation time stamp in org details
- Add endpoint to invite new users to an organization
- Add endpoints for role changing for authority and participants
- Add endpoints to deactivate users
- Add endpoints to reactivate users
- Unregister own connectors

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