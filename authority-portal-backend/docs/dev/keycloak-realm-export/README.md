## About This Script

### What does this script do?

This Shell script will replace the [realm.json](../../../authority-portal-quarkus/src/main/resources/realm.json) 
from the running Quarkus Devservice Keycloak Container, exporting the realm "authority-portal"

### How to execute this script?

To run this script, execute the following command from the backend project's root.

```shell
./docs/dev/keycloak-realm-export/extract-realm.sh
```

### Why do we need this script?

Manually keeping track of the Realm Config JSON is very tedious. Editing the realm through Keycloak remains the easiest way
