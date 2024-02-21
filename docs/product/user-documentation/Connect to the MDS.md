# Connect to the MDS

The Eclipse Dataspace Components (EDC) Connector is the key component for connecting to the MDS and providing and consuming data.
There are two options to access the MDS with:

- Connector-as-a-Service (CaaS)
- On-premise installation

## Connector-as-a-Service

The CaaS is the simplest way to receive a registered and compliant connector.
More information on the CaaS can be found [here](https://github.com/Mobility-Data-Space/mobility-data-space/wiki/).

## On-premise installation

The installation of an on-premise connector consists of two steps:

1. Issue a certificate 
2. Set up and configure the connector

### 1. Issue a certificate

To configure and deploy a connector, a certificate is required.
Therefore, the on-premise installation starts with issuing a certificate, which is done via the MDS Portal.

Visit the Connectors page in the MDS Portal and click on “Register Connector”.
 
![on-premise installation-1](images/on-premise-installation-1.png)

Fill out the registration-mask.
Make sure to provide the correct connector base URL.
Example base URL: https://test-connector.hosting-environment.io (For further information click on the "?" icon)
 
![on-premise installation-2](images/on-premise-installation-2.png)

Click on “Generate & Download Certificate” and fill out the certificate generation form.
All fields are mandatory.

![on-premise installation-3](images/on-premise-installation-3.png)
 
Click on “Generate & Download” to receive the certificate.
The certificate will automatically be filled into the respective field in the registration form and the download will be triggered.
In case the download failed or was aborted, the "Download Certificate" button can be used to download the certificate again.
Click on “Register” to finalize the connector registration process.

The Connectors page should now display the registered connector. 

 ![on-premise installation-4](images/on-premise-installation-4.png)

### 2. Setup and configure the connector

We recommend to use the MDS Version of the Eclipse Dataspace Connector, which is used as reference for configuration. Nevertheless, you can use any other connector which is compatible with the EDC, MDS Catalog and MDS Clearing House.

A deployment guide for self-hosting a functional MDS CE EDC Connector can be found in the [MDS Wiki](https://github.com/Mobility-Data-Space/mobility-data-space/wiki) under Connector On-Premise - 2. Step (Configuration).



