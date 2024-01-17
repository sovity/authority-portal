-- User
create type user_onboarding_type as enum ('INVITATION', 'SELF_REGISTRATION');

alter table "user"
    add column email text,
    add column first_name text,
    add column last_name text,
    add column job_title text,
    add column phone text,
    add column onboarding_type user_onboarding_type,
    add column invited_by text,
    add constraint fk_invited_by foreign key (invited_by) references "user" (id);

update "user" set onboarding_type = 'SELF_REGISTRATION' where onboarding_type is null;

-- Organization
alter table "organization"
    add column business_unit text,
    add column billing_address text,
    add column tax_id text,
    add column commerce_register_number text,
    add column commerce_register_location text,
    add column main_contact_name text,
    add column main_contact_email text,
    add column main_contact_phone text,
    add column tech_contact_name text,
    add column tech_contact_email text,
    add column tech_contact_phone text;

update "organization" set main_contact_email = security_email;

alter table "organization"
    drop column duns,
    drop column security_email;

-- Connector
create type connector_broker_registration_status as enum ('REGISTERED', 'UNREGISTERED');

alter table "connector"
    add column broker_registration_status connector_broker_registration_status not null default 'UNREGISTERED';

