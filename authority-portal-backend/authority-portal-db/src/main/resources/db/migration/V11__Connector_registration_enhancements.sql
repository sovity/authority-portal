alter type connector_type
    add value 'AWAITING_PROVISIONING' after 'CAAS';

alter table connector
    drop column broker_registration_status;
