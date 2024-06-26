/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {
  IdResponse,
  InviteOrganizationRequest,
  MemberInfo,
  OnboardingOrganizationUpdateDto,
  OrganizationDetailsDto,
  OrganizationOverviewEntryDto,
  OrganizationOverviewResult,
  OwnOrganizationDetailsDto,
  UpdateOrganizationDto,
} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from 'src/app/core/utils/object-utils';
import {getUserInfo} from './fake-users';

export const approveOrganization = (mdsId: string): IdResponse => {
  updateOrganization(mdsId, () => ({registrationStatus: 'ACTIVE'}));

  return {id: mdsId, changedDate: new Date()};
};

export const rejectOrganization = (mdsId: string): IdResponse => {
  updateOrganization(mdsId, () => ({registrationStatus: 'REJECTED'}));

  return {id: mdsId, changedDate: new Date()};
};

export let TEST_ORGANIZATIONS: OrganizationDetailsDto[] = [
  {
    mdsId: 'MDSL1111AA',
    name: 'Dev Organization 1',
    businessUnit: 'Business Unit 1',
    industry: 'Information and communication technology',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'ONBOARDING',
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-000000000001',
        firstName: 'Authority',
        lastName: 'Admin',
        roles: ['AUTHORITY_ADMIN', 'AUTHORITY_USER', 'ADMIN', 'USER'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-000000000002',
        firstName: 'Authority',
        lastName: 'User',
        roles: ['AUTHORITY_USER', 'USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    createdByUserId: '00000000-0000-0000-0000-000000000001',
    createdByFirstName: 'Authority',
    createdByLastName: 'Admin',
    mainContactName: 'Authority Admin',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
    createdAt: new Date('2023-08-05T00:00:00.000Z'),
  },

  {
    mdsId: 'MDSL2222BB',
    name: 'Dev Organization 2',
    businessUnit: 'Business Unit 2',
    industry: 'Software development',
    mainAddress: '222 Main St, Anytown, USA',
    billingAddress: 'Billing Address 2',
    legalId: '33-000-0000',
    legalIdType: 'COMMERCE_REGISTER_INFO',
    commerceRegisterLocation: 'Anytown, USA',
    url: 'https://example2.com',
    description: 'Description 2',
    registrationStatus: 'ACTIVE',
    memberCount: 2,
    connectorCount: 3,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-000000000003',
        firstName: 'Participant',
        lastName: 'Admin',
        roles: ['ADMIN', 'KEY_USER', 'USER'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-000000000004',
        firstName: 'Participant',
        lastName: 'User',
        roles: ['USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    createdByUserId: '00000000-0000-0000-0000-000000000003',
    createdByFirstName: 'Participant',
    createdByLastName: 'Admin',
    mainContactName: 'Participant Admin',
    mainContactEmail: 'admin@example2.com',
    mainContactPhone: '111-222-3333',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example2.com',
    techContactPhone: '444-555-6666',
    createdAt: new Date('2023-08-06T00:00:00.000Z'),
  },

  {
    mdsId: 'MDSL3333CC',
    name: 'Test Orga',
    businessUnit: 'Business Unit 1',
    industry: 'Software development',
    mainAddress: 'Gross Str 1, 11223 Test City',
    billingAddress: 'Billing Address 1',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'PENDING',
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-00000012',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['ADMIN'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-00000013',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    createdByUserId: '00000000-0000-0000-0000-00000012',
    createdByFirstName: 'John',
    createdByLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
    createdAt: new Date('2023-08-01T00:00:00.000Z'),
  },

  {
    mdsId: 'MDSL3331C1',
    name: 'Dev Organization 3.1',
    businessUnit: 'Business Unit 1',
    industry: 'Software development',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'PENDING',
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-00000022',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['ADMIN'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-00000023',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    createdByUserId: '00000000-0000-0000-0000-00000022',
    createdByFirstName: 'John',
    createdByLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
    createdAt: new Date('2022-10-01T00:00:00.000Z'),
  },

  {
    mdsId: 'MDSL3332C2',
    name: 'Dev Organization 3.2',
    businessUnit: 'Business Unit 1',
    industry: 'Software development',
    mainAddress: '332 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'ACTIVE',
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-00000032',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['ADMIN'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-00000033',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    createdByUserId: '00000000-0000-0000-0000-00000032',
    createdByFirstName: 'John',
    createdByLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
    createdAt: new Date('2022-10-02T00:00:00.000Z'),
  },

  {
    mdsId: 'MDSL3333C3',
    name: 'Dev Organization 3.3',
    businessUnit: 'Business Unit 1',
    industry: 'Software development',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'ACTIVE',
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-00000042',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['ADMIN'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-00000043',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['USER'],
        registrationStatus: 'INVITED',
      },
    ],
    createdByUserId: '00000000-0000-0000-0000-00000042',
    createdByFirstName: 'John',
    createdByLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
    createdAt: new Date('2022-10-03T00:00:00.000Z'),
  },

  {
    mdsId: 'MDSL3334C4',
    name: 'Dev Organization 3.4',
    businessUnit: 'Business Unit 1',
    industry: 'Software development',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'PENDING',
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-00000052',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['ADMIN'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-00000053',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['USER'],
        registrationStatus: 'PENDING',
      },
    ],
    createdByUserId: '00000000-0000-0000-0000-00000052',
    createdByFirstName: 'John',
    createdByLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
    createdAt: new Date('2022-10-04T00:00:00.000Z'),
  },

  {
    mdsId: 'MDSL7777AA',
    name: 'Service Partner Organization',
    businessUnit: 'Business Unit 7',
    industry: 'Software development',
    mainAddress: '331 Main St, Anytown, USA',
    billingAddress: 'Billing Address 7',
    description: 'Description 7',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    registrationStatus: 'ACTIVE',
    url: 'https://example33.com',
    createdAt: new Date('2022-10-01T00:00:00.000Z'),
    memberList: [
      {
        userId: '00000000-0000-0000-0000-000000000007',
        firstName: 'Service Partner',
        lastName: 'PartAdmin',
        roles: ['SERVICE_PARTNER_ADMIN', 'ADMIN', 'KEY_USER', 'USER'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-000000000008',
        firstName: 'Service Partner',
        lastName: 'PartUser',
        roles: ['USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    createdByUserId: '00000000-0000-0000-0000-00000052',
    createdByFirstName: 'John',
    createdByLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
  },

  {
    mdsId: 'MDSL8888EE',
    name: 'Operator Organization',
    businessUnit: 'Business Unit 8',
    industry: 'Software development',
    mainAddress: '331 Main St, Anytown, USA',
    billingAddress: 'Billing Address 8',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    description: 'Description 8',
    registrationStatus: 'ACTIVE',
    url: 'https://example31.com',
    createdAt: new Date('2022-10-01T00:00:00.000Z'),
    memberList: [
      {
        userId: '00000000-0000-0000-0000-000000000009',
        firstName: 'Operator',
        lastName: 'Admin',
        roles: ['OPERATOR_ADMIN', 'ADMIN', 'KEY_USER', 'USER'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-000000000010',
        firstName: 'Operator',
        lastName: 'User',
        roles: ['USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    createdByUserId: '00000000-0000-0000-0000-00000053',
    createdByFirstName: 'John',
    createdByLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
  },
  {
    mdsId: 'MDSL6666EE',
    name: 'Rejected Organization',
    businessUnit: 'Business Unit 6',
    industry: 'Software development',
    mainAddress: '331 Main St, Anytown, USA',
    billingAddress: 'Billing Address 6',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    description: 'Description 8',
    registrationStatus: 'REJECTED',
    url: 'https://rej.com',
    createdAt: new Date('2022-10-01T00:00:00.000Z'),
    memberList: [
      {
        userId: '00000000-0000-0000-0000-000000000011',
        firstName: 'Rejected',
        lastName: 'User',
        roles: ['ADMIN', 'KEY_USER', 'USER'],
        registrationStatus: 'REJECTED',
      },
    ],
    memberCount: 1,
    connectorCount: 1,
    dataOfferCount: 0,
    createdByUserId: '00000000-0000-0000-0000-00000011',
    createdByFirstName: 'Rejected',
    createdByLastName: 'User',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
  },
  {
    mdsId: 'MDSL9111ZZ',
    name: 'Three Users',
    businessUnit: 'Business Unit 1',
    industry: 'Software development',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    legalId: '33-000-0000',
    legalIdType: 'TAX_ID',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'ACTIVE',
    memberCount: 3,
    connectorCount: 0,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-100000000001',
        firstName: 'New Participant',
        lastName: 'Admin',
        roles: ['ADMIN', 'USER'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-100000000002',
        firstName: 'Organization',
        lastName: 'Creator',
        roles: ['ADMIN', 'USER'],
        registrationStatus: 'ACTIVE',
      },
      {
        userId: '00000000-0000-0000-0000-100000000003',
        firstName: 'Normal',
        lastName: 'User',
        roles: ['AUTHORITY_USER', 'USER'],
        registrationStatus: 'ACTIVE',
      },
    ],
    mainContactName: 'Authority Admin',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '+49 1234 567890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '+49 9876 543210',
    createdAt: new Date('2023-08-05T00:00:00.000Z'),
    createdByUserId: '00000000-0000-0000-0000-100000000002',
    createdByFirstName: 'Organization',
    createdByLastName: 'Creator',
  },
];

export const updateOrganization = (
  mdsId: string,
  patcher: Patcher<OrganizationDetailsDto>,
) => {
  TEST_ORGANIZATIONS = TEST_ORGANIZATIONS.map((organization) => {
    return organization.mdsId === mdsId
      ? patchObj(organization, patcher)
      : organization;
  });
};

export const getOrganizationDetails = (
  mdsId: string,
): OrganizationDetailsDto => {
  return TEST_ORGANIZATIONS.find(
    (organization) => organization.mdsId === mdsId,
  ) as OrganizationDetailsDto;
};

export const getOrganizations = (): OrganizationDetailsDto[] => {
  return TEST_ORGANIZATIONS;
};

export const getParticipantAdmins = (
  org: OrganizationDetailsDto,
): MemberInfo[] => {
  return org.memberList.filter(
    (x) => x.roles.find((y) => y === 'ADMIN') !== undefined,
  );
};

export const getListOfOrganizationsForTable =
  (): OrganizationOverviewResult => {
    return {
      organizations: TEST_ORGANIZATIONS.map(
        (organization: OrganizationDetailsDto) => {
          return {
            mdsId: organization.mdsId,
            name: organization.name,
            mainContactEmail: organization.mainContactEmail,
            numberOfUsers: organization.memberCount,
            numberOfConnectors: organization.connectorCount,
            numberOfDataOffers: organization.dataOfferCount,
            registrationStatus: organization.registrationStatus,
          } satisfies OrganizationOverviewEntryDto;
        },
      ),
    };
  };

export const getOwnOrganizationDetails = (): OwnOrganizationDetailsDto => {
  const details = getOrganizationDetails(getUserInfo().organizationMdsId);
  return {
    mdsId: details.mdsId,
    name: details.name,
    businessUnit: details.businessUnit,
    industry: details.industry,
    mainAddress: details.mainAddress,
    billingAddress: details.billingAddress,
    legalIdType: details.legalIdType,
    legalId: details.legalId,
    commerceRegisterLocation: details.commerceRegisterLocation,
    url: details.url,
    description: details.description,
    registrationStatus: details.registrationStatus,
    memberList: details.memberList,
    createdByUserId: details.createdByUserId,
    createdByFirstName: details.createdByFirstName,
    createdByLastName: details.createdByLastName,
    mainContactName: details.mainContactName,
    mainContactEmail: details.mainContactEmail,
    mainContactPhone: details.mainContactPhone,
    techContactName: details.techContactName,
    techContactEmail: details.techContactEmail,
    techContactPhone: details.techContactPhone,
    createdAt: details.createdAt,
  };
};

export const updateOwnOrganization = (
  request: UpdateOrganizationDto,
): IdResponse => {
  const mdsId = getUserInfo().organizationMdsId;
  updateOrganization(mdsId, () => ({
    url: request.url,
    description: request.description,
    businessUnit: request.businessUnit,
    industry: request.industry,
    mainAddress: request.address,
    billingAddress: request.billingAddress,
    mainContactName: request.mainContactName,
    mainContactEmail: request.mainContactEmail,
    mainContactPhone: request.mainContactPhone,
    techContactName: request.techContactName,
    techContactEmail: request.techContactEmail,
  }));
  return {id: mdsId, changedDate: new Date()};
};

export const inviteOrganization = (
  request: InviteOrganizationRequest,
): IdResponse => {
  return {id: '', changedDate: new Date()};
};

export const onboardOrganization = (
  request: OnboardingOrganizationUpdateDto,
): IdResponse => {
  return {id: 'MDSL8888EE', changedDate: new Date()};
};

export const deleteOrganization = (mdsId: string) => {
  TEST_ORGANIZATIONS = TEST_ORGANIZATIONS.filter((x) => x.mdsId !== mdsId);
};
