create type my_example_status as enum ('OK', 'FAILURE');

create table my_example
(
    id         text                     not null primary key,
    message    text                     not null,
    created_at timestamp with time zone not null,
    status     my_example_status        not null
);

create table "organization"
(
    mds_id         text not null primary key,
    name           text not null,
    address        text not null,
    duns           text not null,
    url            text not null,
    security_email text not null,
    created_by     text not null
);
