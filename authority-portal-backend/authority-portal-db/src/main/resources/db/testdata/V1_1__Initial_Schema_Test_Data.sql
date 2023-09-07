-- Insert example data
insert into "user" (id, organization_mds_id, registration_status)
values ('9525c6ea-34d5-4c11-b9f8-133dc2086f00', null, 'APPROVED');

insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL0123456789ZZ', 'Example Organization', '123 Main St, Anytown, USA', '34-398-4588', 'https://example.com',
        'security@example.com', '9525c6ea-34d5-4c11-b9f8-133dc2086f00', 'APPROVED');

update "user" set organization_mds_id = 'MDSL0123456789ZZ' where id = '9525c6ea-34d5-4c11-b9f8-133dc2086f00';

-- Insert dev user data
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000001', null, 'APPROVED');
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000002', null, 'APPROVED');
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000003', null, 'APPROVED');
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000004', null, 'APPROVED');
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000005', null, 'PENDING');

insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL1111111111AA', 'Dev Organization 1', '111 Main St, Anytown, USA', '11-111-1111', 'https://example1.com',
        'security@example1.com', '00000000-0000-0000-0000-00000001', 'APPROVED');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL2222222222BB', 'Dev Organization 2', '222 Main St, Anytown, USA', '22-222-2222', 'https://example2.com',
        'security@example2.com', '00000000-0000-0000-0000-00000003', 'APPROVED');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL3333333333CC', 'Dev Organization 3', '333 Main St, Anytown, USA', '33-333-3333', 'https://example3.com',
        'security@example3.com', '00000000-0000-0000-0000-00000005', 'PENDING');

update "user" set organization_mds_id = 'MDSL1111111111AA' where id = '00000000-0000-0000-0000-00000001';
update "user" set organization_mds_id = 'MDSL1111111111AA' where id = '00000000-0000-0000-0000-00000002';
update "user" set organization_mds_id = 'MDSL2222222222BB' where id = '00000000-0000-0000-0000-00000003';
update "user" set organization_mds_id = 'MDSL2222222222BB' where id = '00000000-0000-0000-0000-00000004';
update "user" set organization_mds_id = 'MDSL3333333333CC' where id = '00000000-0000-0000-0000-00000005';
