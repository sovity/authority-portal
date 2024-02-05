-- User
create type user_onboarding_type as enum ('INVITATION', 'SELF_REGISTRATION');

alter table "user"
    add column onboarding_type user_onboarding_type,
    add column invited_by text,
    add constraint fk_invited_by foreign key (invited_by) references "user" (id);

update "user" set onboarding_type = 'SELF_REGISTRATION' where onboarding_type is null;

-- Connector
create type connector_broker_registration_status as enum ('REGISTERED', 'UNREGISTERED');

alter table "connector"
    add column broker_registration_status connector_broker_registration_status not null default 'UNREGISTERED',
    add column management_url text,
    add column endpoint_url text,
    add column jwks_url text;

alter table "connector"
    rename column url to frontend_url;

-- Fallback in case someone tries to migrate from 0.x to 1.0
update "connector"
set management_url = frontend_url || '/api/management' where management_url is null;

update "connector"
set endpoint_url = frontend_url || '/api/dsp' where endpoint_url is null;
