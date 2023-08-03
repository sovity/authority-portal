create type my_example_status as enum ('OK', 'FAILURE');

create table my_example
(
    id         text                     not null primary key,
    message    text                     not null,
    created_at timestamp with time zone not null,
    status     my_example_status        not null
);