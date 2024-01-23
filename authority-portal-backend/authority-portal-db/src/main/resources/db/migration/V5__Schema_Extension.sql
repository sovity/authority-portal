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
    add column broker_registration_status connector_broker_registration_status not null default 'UNREGISTERED';
