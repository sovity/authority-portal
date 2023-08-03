-- These migrations tests if migrations fail if executed against a non-empty db

insert into my_example
values ('1', 'Hello World', now(), 'OK');
