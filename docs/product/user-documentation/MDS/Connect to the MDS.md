# Connect to the MDS

## Environments

The MDS Portal provides different deployment environments for you to use.
Environments can be switched via the selector in the top bar of the MDS Portal.

![environment-selector](images/connect-to-the-mds/environment-selector.png)

The selection is global and affects all areas of the portal that deal with connectors.
Also, the amount of free CaaS is limited per environment.

## Connectors

The Eclipse Dataspace Components (EDC) Connector is the key component for connecting to the MDS and providing and consuming data.
There are two options to access the MDS with:

- Connector-as-a-Service (CaaS)
- On-premise installation

### Connector-as-a-Service

The CaaS is the simplest way to receive a registered and compliant connector.

If you seek to add a CaaS to your organization in the MDS, click "Add Connector".

![add-connector](images/connect-to-the-mds/add-connector.png)

Select "I need a connector".

![choose-connector](images/connect-to-the-mds/choose-connector-registration.png)

In case the amount of free connectors for the selected environment is not exceeded, you will be able to proceed with the registration.

![request-caas](images/connect-to-the-mds/request-caas.png)

Fill out the CaaS details and click "Request CaaS".

![request-caas-form](images/connect-to-the-mds/request-caas-form.png)

After the registration, you will find your newly registered CaaS in the "Connectors" list.
The provisioning process of your new connector may take some time and the current status can be tracked in the connector details.

![connector-list-with-example-caas](images/connect-to-the-mds/connector-list-with-example-caas.png)

### On-premise installation

The installation of an on-premise connector consists of two steps:

1. Register your connector 
2. Set up and configure the connector

#### 1. Register your connector

If you seek to add a Connector to your organization in the MDS, click "Add Connector".

![add-connector](images/connect-to-the-mds/add-connector.png)

Select "I have a connector".

![choose-connector](images/connect-to-the-mds/choose-connector-registration.png)

Fill out the "Add Connector Details" form and click "Next" to proceed.

![register-connector-form](images/connect-to-the-mds/register-connector-form.png)

After entering your Connector details, you now need to give the stated information in the "Generate Certificate" form and click "Generate & Download Certificate".

![register-connector-generate-certificate](images/connect-to-the-mds/register-connector-generate-certificate.png)

The certificate will automatically be filled into the respective field in the registration form and the download will be triggered.
Click on “Register Connector” to finalize the connector registration process.

![register-connector-finish](images/connect-to-the-mds/register-connector-finish.png)

On the following page you will find further instructions on how to set up your on-premise Connector and a link to the open-source repository edc-ce (sovity EDC Community Edition) providing all you need to set up your Connector.

Find your newly registered Connector in the "Connectors" list.

![connector-list-with-example-edc](images/connect-to-the-mds/connector-list-with-example-edc.png)

#### 2. Setup and configure the connector

We recommend using the MDS version of the Eclipse Dataspace Connector, which is used as reference for configuration. Nevertheless, you can use any other connector which is compatible with the EDC, MDS Catalogue and MDS Logging House.

A deployment guide for self-hosting a functional MDS CE EDC Connector can be found in the [MDS Wiki](https://github.com/Mobility-Data-Space/mobility-data-space/wiki) under Connector On-Premise - 2. Step (Configuration).



