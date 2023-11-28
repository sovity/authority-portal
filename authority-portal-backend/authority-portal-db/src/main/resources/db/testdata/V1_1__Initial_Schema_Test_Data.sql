-- Insert example data
insert into "user" (id, organization_mds_id, registration_status)
values ('9525c6ea-34d5-4c11-b9f8-133dc2086f00', null, 'APPROVED');

insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL1234ZZ', 'Example Organization', '123 Main St, Anytown, USA', '34-398-4588', 'https://example.com',
        'security@example.com', '9525c6ea-34d5-4c11-b9f8-133dc2086f00', 'APPROVED');

update "user" set organization_mds_id = 'MDSL1234ZZ' where id = '9525c6ea-34d5-4c11-b9f8-133dc2086f00';

-- Insert dev data
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
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000007', null, 'APPROVED');
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000008', null, 'PENDING');
insert into "user" (id, organization_mds_id, registration_status)
values ('00000000-0000-0000-0000-00000009', null, 'PENDING');

insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL1111AA', 'Dev Organization 1', '111 Main St, Anytown, USA', '11-111-1111', 'https://example1.com',
        'security@example1.com', '00000000-0000-0000-0000-00000001', 'APPROVED');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL2222BB', 'Dev Organization 2', '222 Main St, Anytown, USA', '22-222-2222', 'https://example2.com',
        'security@example2.com', '00000000-0000-0000-0000-00000003', 'APPROVED');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL3333CC', 'Dev Organization 3', '333 Main St, Anytown, USA', '33-333-3333', 'https://example3.com',
        'security@example3.com', '00000000-0000-0000-0000-00000005', 'PENDING');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL3331C1', 'Dev Organization 3.1', '331 Main St, Anytown, USA', '33-333-3331', 'https://example31.com',
        'security@example31.com', '00000000-0000-0000-0000-00000005', 'PENDING');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL3332C2', 'Dev Organization 3.2', '332 Main St, Anytown, USA', '33-333-3332', 'https://example32.com',
        'security@example32.com', '00000000-0000-0000-0000-00000005', 'PENDING');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL3333C3', 'Dev Organization 3.3', '334 Main St, Anytown, USA', '33-333-3334', 'https://example33.com',
        'security@example33.com', '00000000-0000-0000-0000-00000005', 'PENDING');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL3334C4', 'Dev Organization 3.4', '335 Main St, Anytown, USA', '33-333-3335', 'https://example34.com',
        'security@example34.com', '00000000-0000-0000-0000-00000005', 'PENDING');
insert into "organization" (mds_id, name, address, duns, url, security_email, created_by, registration_status)
values ('MDSL2222CC', 'Dev Organization 3.5', '335 Main St, Anytown, USA', '33-333-3335', 'https://example34.com',
        'security@example34.com', '00000000-0000-0000-0000-00000008', 'PENDING');

update "user" set organization_mds_id = 'MDSL1111AA' where id = '00000000-0000-0000-0000-00000001';
update "user" set organization_mds_id = 'MDSL1111AA' where id = '00000000-0000-0000-0000-00000002';
update "user" set organization_mds_id = 'MDSL2222BB' where id = '00000000-0000-0000-0000-00000003';
update "user" set organization_mds_id = 'MDSL2222BB' where id = '00000000-0000-0000-0000-00000004';
update "user" set organization_mds_id = 'MDSL3333CC' where id = '00000000-0000-0000-0000-00000005';
update "user" set organization_mds_id = 'MDSL2222BB' where id = '00000000-0000-0000-0000-00000007';

insert into "connector" (connector_id, mds_id, provider_mds_id, type, environment, client_id, name, location, url, created_by, created_at)
values ('MDSL2222BB.CP59I8U', 'MDSL2222BB', 'MDSL2222BB', 'OWN', 'test', 'F3:64:FD:0B:CD:B9:E1:E3:3F:29:C2:32:7F:15:AE:E3:8F:76:88:58:keyid:93:37:7D:FE:04:F3:A8:82:47:89:09:E9:1D:B3:3A:E1:92:1D:B1:4C', 'Example Connector', 'Here', 'https://xample.test1/connector', '00000000-0000-0000-0000-00000003', '2023-09-21 07:24:19.644647 +00:00');
insert into "connector" (connector_id, mds_id, provider_mds_id, type, environment, client_id, name, location, url, created_by, created_at)
values ('MDSL2222BB.CFIWWBD', 'MDSL2222BB', 'MDSL2222BB', 'OWN', 'test', 'F3:64:FD:0B:CD:B9:E1:E3:3F:29:C2:32:7F:15:AE:E3:8F:76:88:58:keyid:93:37:7D:FE:04:F3:A8:82:47:89:09:E9:1D:B3:3A:E1:92:1D:B1:4C', 'Example Connector', 'Here', 'https://xample.test2/connector', '00000000-0000-0000-0000-00000003', '2023-09-21 07:24:41.983389 +00:00');
insert into "connector" (connector_id, mds_id, provider_mds_id, type, environment, client_id, name, location, url, created_by, created_at)
values ('MDSL2222BB.CWAQ71U', 'MDSL2222BB', 'MDSL2222BB', 'OWN', 'test', 'F3:64:FD:0B:CD:B9:E1:E3:3F:29:C2:32:7F:15:AE:E3:8F:76:88:58:keyid:93:37:7D:FE:04:F3:A8:82:47:89:09:E9:1D:B3:3A:E1:92:1D:B1:4C', 'Example Connector', 'Here', 'https://xample.test3/connector', '00000000-0000-0000-0000-00000003', '2023-09-21 07:24:44.657431 +00:00');
insert into "connector" (connector_id, mds_id, provider_mds_id, type, environment, client_id, name, location, url, created_by, created_at)
values ('MDSL1111AA.CP59I8U', 'MDSL1111AA', 'MDSL1111AA', 'OWN', 'test', 'F3:64:FD:0B:CD:B9:E1:E3:3F:29:C2:32:7F:15:AE:E3:8F:76:88:58:keyid:93:37:7D:FE:04:F3:A8:82:47:89:09:E9:1D:B3:3A:E1:92:1D:B1:4C', 'Example Connector', 'Here', 'https://xample.test4/connector', '00000000-0000-0000-0000-00000001', '2023-09-21 07:24:44.657431 +00:00');
insert into "connector" (connector_id, mds_id, provider_mds_id, type, environment, client_id, name, location, url, created_by, created_at)
values ('MDSL2222CC.CP59I9V', 'MDSL2222CC', 'MDSL2222CC', 'OWN', 'test', 'F3:64:FD:0B:CD:B9:E1:E3:3F:29:C2:32:7F:15:AE:E3:8F:76:88:58:keyid:93:37:7D:FE:04:F3:A8:82:47:89:09:E9:1D:B3:3A:E1:92:1D:B1:4C', 'Example Connector', 'Here', 'https://xample.test4/connector', '00000000-0000-0000-0000-00000001', '2023-09-21 07:24:44.657431 +00:00');
