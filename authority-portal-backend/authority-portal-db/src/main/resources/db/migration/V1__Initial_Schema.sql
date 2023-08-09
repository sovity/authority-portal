create type my_example_status as enum ('OK', 'FAILURE');

create table my_example
(
    id         text                     not null primary key,
    message    text                     not null,
    created_at timestamp with time zone not null,
    status     my_example_status        not null
);

create type user_role as enum ('ADMIN', 'USER');

create table "user"
(
    id         text                     not null primary key,
    first_name text                     not null,
    last_name  text                     not null,
    created_at timestamp with time zone not null,
    role       user_role                not null
);
