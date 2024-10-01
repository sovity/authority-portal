# Roles and Rights
A matrix containing parties and capabilites as basis for deciding user and application roles

| Area              | Type    | Action                                 | Scope      | User | Key User | Admin   | Authority User | Authority Admin | Service Partner Admin | Operator Admin |
| ----------------- | ------- | -------------------------------------- |------------|------|----------|---------|----------------|-----------------|-----------------------|----------------|
| User              | Process | Invite User (incl. Roles)              | Own Org    |      |          | x       |                |                 |                       |                |
| User              | Process | Reset Passwort                         | Self       | x    |          |         |                |                 |                       |                |
| User              | Data    | Userprofile (Info)                     | Self       | r, u |          |         |                |                 |                       |                |
| User              | Data    | Userprofile (Info)                     | Own Org    | r    |          |         |                |                 |                       |                |
| User              | Data    | Userprofile (Info)                     | Other Orgs |      |          |         | r              |                 |                       |                |
| User              | Data    | Userprofile (reactivate, deactivate)   | Self       |      |          |         |                |                 |                       |                |
| User              | Data    | Userprofile (reactivate, deactivate)   | Own Org    |      |          | x       |                | x               |                       |                |
| User              | Data    | Userprofile (reactivate, deactivate)   | Other Orgs |      |          |         |                | x               |                       |                |
| User              | Data    | Userprofile (delete)                   | Self       |      |          |         |                |                 |                       |                |
| User              | Data    | Userprofile (delete)                   | Own Org    |      |          | x       |                | x               |                       |                |
| User              | Data    | Userprofile (delete)                   | Other Orgs |      |          |         |                | x               |                       |                |
| User              | Data    | Participant Roles                      | Self       | r    |          |         |                |                 |                       |                |
| User              | Data    | Participant Roles                      | Own Org    | r    |          | u       |                |                 |                       |                |
| User              | Data    | Participant Roles                      | Other Orgs |      |          |         | r              |                 |                       |                |
| User              | Data    | Application Roles                      | Self       | r    |          |         |                |                 |                       |                |
| User              | Data    | Application Roles                      | Own Org    | r    |          |         |                | u,d             | u,d                   | u,d            |
| User              | Data    | Application Roles                      | Other Orgs |      |          |         | r              | u,d             |                       |                |
| User              | Data    | Comp. Internal Identity Provider       | Own Org    | r    |          | c, u, d |                |                 |                       |                |
| User              | Data    | Comp. Internal Identity Provider       | Other Orgs |      |          |         |                | r               |                       |                |
| Organization      | Process | Organization invitation                | Other Orgs |      |          |         | x              |                 |                       |                |
| Organization      | Process | Organization activation                | Other Orgs |      |          |         | x              |                 |                       |                |
| Organization      | Process | Organization removal                   | Other Orgs |      |          |         | x              |                 |                       |                |
| Organization      | Data    | Organization Profile                   | Own Org    | r    |          | u       |                |                 |                       |                |
| Organization      | Data    | Organization Profile                   | Other Orgs |      |          |         | r              | c, u, d         | r                     | r              |
| Data Matching     | Data    | Place data offerings/requests          | Own Org    | r    | c, u, d  |         |                |                 |                       |                |
| Data Matching     | Data    | Place data offerings/requests          | Other Orgs | r    |          |         |                | d               |                       |                |
| Admin             | Data    | Service partner integration management | Global     |      |          |         |                | c, r, u, d      |                       |                |
| Admin             | Process | Deploy connector                       | Other Orgs |      |          |         |                |                 | x                     |                |
| Admin             | Data    | Connector Management                   | Own Org    | r    | c, u, d  |         |                |                 |                       |                |
| Admin             | Data    | Connector Management                   | Other Orgs |      |          |         | r              | u               | c, u, d               | r, d           |
| Admin             | Data    | Portal configuration                   | Global     |      |          |         |                | r               |                       | r, u           |
| Admin             | Data    | Central component management           | Global     |      |          |         |                |                 |                       | c, r, u        |
| Status Monitoring | Data    | Connector Status                       | Global     | r    |          |         |                |                 |                       |                |
| Status Monitoring | Data    | DAPS Status                            | Global     | r    |          |         |                |                 |                       |                |
| Status Monitoring | Data    | ClearingHouse Status                   | Global     | r    |          |         |                |                 |                       |                |
| Status Monitoring | Data    | Debugging/Logging                      | Global     |      |          |         |                | r               |                       | r              |

**c**=create, **r**=read, **u**=update, **d**=delete, **x**=execute