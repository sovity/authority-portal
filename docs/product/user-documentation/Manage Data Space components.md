# Manage the Data Space components

Besides the Data Space Authority roles, there are two other application roles that are able to manage elements of the Data Space.

- Service Partner Admin
- Operator Admin

## Application role: Service Partner Admin

### General

The Service Partner Admin is an application role to represent the provider of connectors in a Data Space. A service partner of a Data Space provides connectors for Data Space participants by deploying and registering these connectors for other entities within the Data Space.
As such, the service partner has direct access to all provided connectors and the application role of Service Partner Admin aims to mirror those capabilities within the Authority Portal.
The Service Partner Admin role is an application role and assigned to certain users individually by Authority Admins.

### Rights for Service Partner Admins

Currently, the Service Partner Admin role grants the following rights in addition to a user's organization role:

1. View a list of provided connectors
2. Provide and delete provided connectors
3. Assign Service Partner Admin role to users within own organization

#### 1. View a list of provided connectors

As a Service Partner Admin a user is able to access the "Provided Connectors" page where all provided connectors are displayed.

![provide-connector](images/provide-connectors-overview.png)

#### 2. Register and delete connectors

When clicking on the button "Provide Connector" in the upper right corner a mask to register a new connector opens.

![provide-connector](images/provide-connector.png)

To provide a connector in the Authority Portal all fields of the mask must be submitted. The process is identical to the registration of connectors for users without any application role but registers the connector for another organization who is named in the slightly changed registration mask. 

You might generate the required certificate within the browser or alternatively via a Linux shell with `openssl` and `keytool` installed:

```bash
$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out connector-certificate.crt -nodes -days 1825
$ openssl pkcs12 -export -in connector-certificate.crt -inkey key.pem -out connector-certificate.p12
$ keytool -importkeystore -srckeystore connector-certificate.p12 -srcstoretype pkcs12 -destkeystore connector-certificate.jks
```

> [!TIP]  
> By ticking the checkbox "Use the Connector's JWKS URL [...]", you can define a JWKS endpoint to automatically fetch the certificate from and thus skip the certificate step. sovity's CaaS (Connector-as-a-Service) are equipped with this functionality.

After clicking on the register button the list of provided connectors appears, where the added connector can be found.

#### 3. Assign Service Partner Admin role to users within own organization

1. Click on "My Organization" in the sidebar menu.
2. Head to the "Users and Roles" page.
3. Select a user's profile of the user that shall become a Service Partner Admin.
4. Edit the application role and change it to Service Partner Admin.
5. Result: An additional Service Partner Admin has been created.

## Application role: Operator Admin

### General

The Operator Admin is an application role to represent the operator of the Mobility Data Space. The operator of the Mobility Data Space deploys the central components of the Data Space in the infrastructure and manages the different environments of the Data Space. As such, the operator has direct access to all central components and the application role of Operator Admin aims to mirror those capabilities within the Authority Portal.
The Operator Admin role is an application role and assigned to certain users individually by Authority Admins.

### Rights for Operator Admins

Currently, the Operator Admin role grants the following rights in addition to a user's organization role:

1. View a list of central components and all connectors
2. Register and delete central components
3. Assign Operator Admin role to users within own organization

#### 1. View a list of central components

As an Operator Admin a user is able to access the "Central Components" page where all registered central components are displayed.

![central-components](images/central-components-list.png)

#### 2. Register and delete central components

When clicking on the button "Provide Central Component" in the upper right corner a mask to register a central component opens.

![provide-central-component](images/provide-central-component.png)

To register a central component in the Authority Portal all fields of the mask must be submitted.
After clicking on the register button the list of central components appears, where the added central component can be found.

#### 3. Assign Operator Admin role to users within own organization

1. Click on "My Organization" in the sidebar menu.
2. Head to the "Users and Roles" page.
3. Select a user's profile of the user that shall become an Operator Admin.
4. Edit the application role and change it to Operator Admin.
5. Result: An additional Operator Admin has been created.
