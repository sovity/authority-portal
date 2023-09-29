# Roles and features

**Every** user of the portal is part of an organization (even the MDS is represented by an organization).
This leads to a certain structure regarding the roles of the users.
Due to the membership in an organization, each user has either the role of an `Participant Admin`, `Participant Curator` or `Participant User`.
Additionally, there are the application wide roles `Authority Admin` and `Authority User` (for the authority members) as well as `Service Partner Admin` and `Operator Admin` (for the service partners and operators).
These additional roles provide additional rights, so that the rights of a certain user are composed of their organization internal roles and their application wide roles.
An Example can be found at the end of this document.

## Organization/Participant related roles

### Participant Admin

Inherits rights from `Participant Curator`.

### Participant Curator

Inherits rights from `Participant User`.

#### Section: My Organization

- Connectors
  - Register connector for own organization

### Participant User

#### Section: My Organization

- Connectors
  - List of all connectors (own)
  - Detail page for connectors (own)

## Authority related roles

### Authority Admin

Inherits rights from `Authority User`.

#### Section: My Organization

- Connectors
  - Provide connector for another organization

### Authority User

#### Section: Authority

- Organizations
  - List of organizations with corresponding statuses
  - Detail page for organizations
    - Approval
    - Rejection

## Additional roles

### Service Partner Admin

#### Section: My Organization

- Connectors
  - Provide connector for another organization

### Operator Admin

Role not yet used.


## Example

User A has the role of `Participant User` in the MDS organization. Additionally, he has the role of `Authority Admin`, so that the resulting rights are the following.

- Connectors
  - List of all connectors (own)
  - Detail page for connectors (own)
  - Provide connector for another organization

- Organizations
  - List of organizations with corresponding statuses
  - Detail page for organizations
    - Approval
    - Rejection