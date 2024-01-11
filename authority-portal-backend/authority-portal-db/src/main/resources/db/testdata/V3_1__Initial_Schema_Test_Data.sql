-- Update records for Example Organization (MDSL1234ZZ)
update "organization"
set
    business_unit = 'Example Business Unit',
    billing_address = '321 Main St, Anytown, USA',
    tax_id = 'US192837465',
    commerce_register_number = 'CRN132',
    commerce_register_location = 'California',
    main_contact_name = 'Main Contact',
    main_contact_email = 'main.contact@example.com',
    main_contact_phone = '0123456789',
    tech_contact_name = 'Tech Contact',
    tech_contact_email = 'tech.contact@example.com',
    tech_contact_phone = '9876543210'
where mds_id = 'MDSL1234ZZ';

-- Update records for Dev Organization 1 (MDSL1111AA)
update "organization"
set
    business_unit = 'Technology Solutions',
    billing_address = '123 Tech Lane, Silicon Valley, USA',
    tax_id = 'US123456789',
    commerce_register_number = 'CRN123',
    commerce_register_location = 'California',
    main_contact_name = 'John Doe',
    main_contact_email = 'john.doe@example.com',
    main_contact_phone = '+1 (555) 123-4567',
    tech_contact_name = 'Jane Smith',
    tech_contact_email = 'jane.smith@example.com',
    tech_contact_phone = '+1 (555) 987-6543'
where mds_id = 'MDSL1111AA';

-- Update records for Dev Organization 2 (MDSL2222BB)
update "organization"
set
    business_unit = 'Financial Services',
    billing_address = '456 Finance Street, New York, USA',
    tax_id = 'US987654321',
    commerce_register_number = 'CRN456',
    commerce_register_location = 'New York',
    main_contact_name = 'Alice Johnson',
    main_contact_email = 'alice.johnson@example.com',
    main_contact_phone = '+1 (555) 234-5678',
    tech_contact_name = 'Bob Williams',
    tech_contact_email = 'bob.williams@example.com',
    tech_contact_phone = '+1 (555) 876-5432'
where mds_id = 'MDSL2222BB';

-- Update records for Dev Organization 3.5 (MDSL3333CC)
update "organization"
set
    business_unit = 'Healthcare Solutions',
    billing_address = '789 Health Plaza, Boston, USA',
    tax_id = 'US543210987',
    commerce_register_number = 'CRN789',
    commerce_register_location = 'Massachusetts',
    main_contact_name = 'Elena Rodriguez',
    main_contact_email = 'elena.rodriguez@example.com',
    main_contact_phone = '+1 (555) 345-6789',
    tech_contact_name = 'Michael Chang',
    tech_contact_email = 'michael.chang@example.com',
    tech_contact_phone = '+1 (555) 987-6543'
where mds_id = 'MDSL3333CC';

-- Update records for Dev Organization 3.1 (MDSL3331C1)
update "organization"
set
    business_unit = 'Education Solutions',
    billing_address = '101 Campus Drive, Anytown, USA',
    tax_id = 'US112233445',
    commerce_register_number = 'CRN101',
    commerce_register_location = 'California',
    main_contact_name = 'David Johnson',
    main_contact_email = 'david.johnson@example.com',
    main_contact_phone = '+1 (555) 111-2222',
    tech_contact_name = 'Emily Smith',
    tech_contact_email = 'emily.smith@example.com',
    tech_contact_phone = '+1 (555) 333-4444'
where mds_id = 'MDSL3331C1';

-- Update records for Dev Organization 3.2 (MDSL3332C2)
update "organization"
set
    business_unit = 'Retail Solutions',
    billing_address = '200 Shopping Street, Cityville, USA',
    tax_id = 'US998877665',
    commerce_register_number = 'CRN200',
    commerce_register_location = 'New York',
    main_contact_name = 'Sarah Thompson',
    main_contact_email = 'sarah.thompson@example.com',
    main_contact_phone = '+1 (555) 555-5555',
    tech_contact_name = 'Brian Davis',
    tech_contact_email = 'brian.davis@example.com',
    tech_contact_phone = '+1 (555) 666-6666'
where mds_id = 'MDSL3332C2';

-- Update records for Dev Organization 3.3 (MDSL3333C3)
update "organization"
set
    business_unit = 'Automotive Solutions',
    billing_address = '500 Innovation Drive, Tech City, USA',
    tax_id = 'US777888999',
    commerce_register_number = 'CRN500',
    commerce_register_location = 'California',
    main_contact_name = 'Alexandra Garcia',
    main_contact_email = 'alexandra.garcia@example.com',
    main_contact_phone = '+1 (555) 777-8888',
    tech_contact_name = 'Christopher Lee',
    tech_contact_email = 'christopher.lee@example.com',
    tech_contact_phone = '+1 (555) 999-0000'
where mds_id = 'MDSL3333C3';

-- Update records for Dev Organization 3.4 (MDSL3334C4)
update "organization"
set
    business_unit = 'Energy Solutions',
    billing_address = '700 Renewable Street, Green City, USA',
    tax_id = 'US456789012',
    commerce_register_number = 'CRN700',
    commerce_register_location = 'Texas',
    main_contact_name = 'Matthew Williams',
    main_contact_email = 'matthew.williams@example.com',
    main_contact_phone = '+1 (555) 123-4567',
    tech_contact_name = 'Olivia Brown',
    tech_contact_email = 'olivia.brown@example.com',
    tech_contact_phone = '+1 (555) 987-6543'
where mds_id = 'MDSL3334C4';

-- Update records for Dev Organization 3.5 (MDSL2222CC)
update "organization"
set
    business_unit = 'Hospitality Solutions',
    billing_address = '800 Hospitality Avenue, Resort City, USA',
    tax_id = 'US345678901',
    commerce_register_number = 'CRN800',
    commerce_register_location = 'Florida',
    main_contact_name = 'Daniel Miller',
    main_contact_email = 'daniel.miller@example.com',
    main_contact_phone = '+1 (555) 234-5678',
    tech_contact_name = 'Sophia Clark',
    tech_contact_email = 'sophia.clark@example.com',
    tech_contact_phone = '+1 (555) 876-5432'
where mds_id  = 'MDSL2222CC';

update "user"
set first_name = 'John',
    last_name  = 'Doe',
    email      = 'john.doe@example.com',
    job_title  = 'Software Engineer',
    phone      = '+1234567890'
where id = '9525c6ea-34d5-4c11-b9f8-133dc2086f00';

update "user" set email = 'email1@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000001';
update "user" set email = 'email2@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000002';
update "user" set email = 'email3@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000003';
update "user" set email = 'email4@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000004';
update "user" set email = 'email5@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000005';
update "user" set email = 'email7@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000007';
update "user" set email = 'email8@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000008';
update "user" set email = 'email9@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000009';
update "user" set email = 'email10@example.com', first_name = 'firstName', last_name = 'lastName' where id = '00000000-0000-0000-0000-00000010';
