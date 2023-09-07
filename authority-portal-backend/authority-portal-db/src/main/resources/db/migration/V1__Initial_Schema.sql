create type user_registration_status as enum ('CREATED', 'PENDING', 'APPROVED', 'REJECTED');

create table "user"
(
    id                  text                     not null primary key,
    organization_mds_id text,
    registration_status user_registration_status not null
);

create type organization_registration_status as enum ('PENDING', 'APPROVED', 'REJECTED');

create table "organization"
(
    mds_id              text                             not null primary key,
    name                text                             not null,
    address             text                             not null,
    duns                text                             not null,
    url                 text                             not null,
    security_email      text                             not null,
    created_by          text                             not null,
    registration_status organization_registration_status not null,
    constraint fk_organization_created_by foreign key (created_by) references "user" (id)
);

alter table "user"
    add constraint fk_user_organization_id
        foreign key (organization_mds_id) references "organization" (mds_id);
