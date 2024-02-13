Deleting Users Manually
==========

This guide assumes access to Keycloak and the Authority Portal DB.
Furthermore, this process will only work for versions **0.x.x** of the Portal.

_Caution: You are operating in an area which is highly prone to user errors. Do not proceed, if you don't know what you are doing!_

## Prerequisites

- Access to the Authority Portal DB
- Access to the IAM Keycloak of the Authority Portal deployment

## Guide

1. Identify the user to be deleted in Keycloak.
   - This can be done by searching for either the user's email or first/last name.
   - Note down the user's `ID`.

2. Check if that user ID is associated with any organization as the creator.
   - Execute `SELECT * FROM organization WHERE created_by = '[userId from KC]'` on the Authority Portal DB.
   - If the query does not return any results, **skip to step 6a**.
   - Note down the organizations `mds_id`.

3. Check if user is the only member of the found organization in Keycloak.
   - Search for the `mds_id` in the `authority-portal` realm's `Groups` tab.
   - Check the members of resulting group's child groups.
      - If there is no other user in the organization, **skip to step 6b**.
      - If there are other users in the organization **and** at least one of them is also part of the `Participant Admin` child group, **skip to step 5**.
      - Otherwise, **proceed with the next step**.

4. If you reach this step, you are attempting to delete a user that is currently the only `Participant Admin` of an organization with more than one member.
   - Contact the user you want to delete and ask them to assign another member of their organization the `Participant Admin` role.
   - **Proceed with the next step**, as soon as the user has assigned another `Participant Admin`.

5. Change the `created_by` attribute of the organization entry in the Portal DB.
   - Decide on which of the other organization member with the role of `Participant Admin` should be the new creator of the organization. (User's `ID` can be obtained from the Keycloak)
   - Execute `UPDATE organization SET created_by = '[userId of Participant Admin]' WHERE mds_id = '[mdsId]'` on the Authority Portal DB.

6. Delete user data.
   - a. With remaining organization members
      - Delete user from Keycloak: `Users` tab of `authority-portal` realm.
      - Delete user from Authority Portal DB: `DELETE FROM "user" WHERE id = '[userId from KC]'`.
   - b. Without remaining organization members (also deletes organization data)
      - Delete user from Keycloak: `Users` tab of `authority-portal` realm.
      - Remove `mds_id` from user data: `UPDATE "user" SET mds_id = NULL WHERE id = '[userId from KC]'`.
      - Delete organization from Authority Portal DB: `DELETE FROM organization WHERE mds_id = '[mdsId]'`.
      - Delete user from Authority Portal DB: `DELETE FROM "user" WHERE id = '[userId from KC]'`.
      - Delete organization from Keycloak: `Groups` tab of `authority-portal` realm, search for `mds_id`.