import {
  IdResponse,
  OrganizationDetailsDto,
  OrganizationOverviewEntryDto,
  OrganizationOverviewResult,
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
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    taxId: '11-111-1111',
    url: 'https://example1.com',
    description: 'Description 1',
    registrationStatus: 'ACTIVE',
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-00000001',
        firstName: 'Authority',
        lastName: 'Admin',
        roles: [
          'AUTHORITY_ADMIN',
          'AUTHORITY_USER',
          'PARTICIPANT_ADMIN',
          'PARTICIPANT_USER',
        ],
        email: 'user1@example.com'
      },
      {
        userId: '00000000-0000-0000-0000-00000002',
        firstName: 'Authority',
        lastName: 'User',
        roles: ['AUTHORITY_USER', 'PARTICIPANT_USER'],
        email: 'user2@example.com'
      },
    ],
    adminUserId: '00000000-0000-0000-0000-00000001',
    adminFirstName: 'Authority',
    adminLastName: 'Admin',
    mainContactName: 'Authority Admin',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '123-456-7890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '987-654-3210',
    createdAt: new Date('2023-08-05T00:00:00.000Z'),
    createdBy: 'Admin',
  },

  {
    mdsId: 'MDSL2222BB',
    name: 'Dev Organization 2',
    businessUnit: 'Business Unit 2',
    mainAddress: '222 Main St, Anytown, USA',
    billingAddress: 'Billing Address 2',
    taxId: '22-222-2222',
    url: 'https://example2.com',
    description: 'Description 2',
    registrationStatus: 'ACTIVE',
    memberCount: 2,
    connectorCount: 3,
    dataOfferCount: 0,
    memberList: [
      {
        userId: '00000000-0000-0000-0000-00000003',
        firstName: 'Participant',
        lastName: 'Admin',
        roles: ['PARTICIPANT_ADMIN', 'PARTICIPANT_CURATOR', 'PARTICIPANT_USER'],
        email: 'user3@example.com'
      },
      {
        userId: '00000000-0000-0000-0000-00000004',
        firstName: 'Participant',
        lastName: 'User',
        roles: ['PARTICIPANT_USER'],
        email: 'user4@example.com'
      },
    ],
    adminUserId: '00000000-0000-0000-0000-00000003',
    adminFirstName: 'Participant',
    adminLastName: 'Admin',
    mainContactName: 'Participant Admin',
    mainContactEmail: 'admin@example2.com',
    mainContactPhone: '111-222-3333',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example2.com',
    techContactPhone: '444-555-6666',
    createdAt: new Date('2023-08-06T00:00:00.000Z'),
    createdBy: 'Admin',
  },

  {
    mdsId: 'MDSL3333CC',
    name: 'Test Orga',
    businessUnit: 'Business Unit 1',
    mainAddress: 'Gross Str 1, 11223 Test City',
    billingAddress: 'Billing Address 1',
    taxId: '11-111-1111',
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
        roles: ['PARTICIPANT_ADMIN'],
        email: 'user12@example.com'
      },
      {
        userId: '00000000-0000-0000-0000-00000013',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
        email: 'user13@example.com'
      },
    ],
    adminUserId: '00000000-0000-0000-0000-00000012',
    adminFirstName: 'John',
    adminLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '123-456-7890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '987-654-3210',
    createdAt: new Date('2023-08-01T00:00:00.000Z'),
    createdBy: 'Admin',
  },

  {
    mdsId: 'MDSL3331C1',
    name: 'Dev Organization 3.1',
    businessUnit: 'Business Unit 1',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    taxId: '11-111-1111',
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
        roles: ['PARTICIPANT_ADMIN'],
        email: 'user22@example.com'
      },
      {
        userId: '00000000-0000-0000-0000-00000023',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
        email: 'user23@example.com'
      },
    ],
    adminUserId: '00000000-0000-0000-0000-00000022',
    adminFirstName: 'John',
    adminLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '123-456-7890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '987-654-3210',
    createdAt: new Date('2022-10-01T00:00:00.000Z'),
    createdBy: 'Admin',
  },

  {
    mdsId: 'MDSL3332C2',
    name: 'Dev Organization 3.2',
    businessUnit: 'Business Unit 1',
    mainAddress: '332 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    taxId: '11-111-1111',
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
        roles: ['PARTICIPANT_ADMIN'],
        email: 'user32@example.com'
      },
      {
        userId: '00000000-0000-0000-0000-00000033',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
        email: 'user33@example.com'
      },
    ],
    adminUserId: '00000000-0000-0000-0000-00000032',
    adminFirstName: 'John',
    adminLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '123-456-7890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '987-654-3210',
    createdAt: new Date('2022-10-02T00:00:00.000Z'),
    createdBy: 'Admin',
  },

  {
    mdsId: 'MDSL3333C3',
    name: 'Dev Organization 3.3',
    businessUnit: 'Business Unit 1',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    taxId: '11-111-1111',
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
        roles: ['PARTICIPANT_ADMIN'],
        email: 'user42@example.com'
      },
      {
        userId: '00000000-0000-0000-0000-00000043',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
        email: 'user43@example.com'
      },
    ],
    adminUserId: '00000000-0000-0000-0000-00000042',
    adminFirstName: 'John',
    adminLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '123-456-7890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '987-654-3210',
    createdAt: new Date('2022-10-03T00:00:00.000Z'),
    createdBy: 'Admin',
  },

  {
    mdsId: 'MDSL3334C4',
    name: 'Dev Organization 3.4',
    businessUnit: 'Business Unit 1',
    mainAddress: '111 Main St, Anytown, USA',
    billingAddress: 'Billing Address 1',
    taxId: '11-111-1111',
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
        roles: ['PARTICIPANT_ADMIN'],
        email: 'user52@example.com'
      },
      {
        userId: '00000000-0000-0000-0000-00000053',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
        email: 'user53@example.com'
      },
    ],
    adminUserId: '00000000-0000-0000-0000-00000052',
    adminFirstName: 'John',
    adminLastName: 'Doe',
    mainContactName: 'John Doe',
    mainContactEmail: 'admin@example1.com',
    mainContactPhone: '123-456-7890',
    techContactName: 'Tech Admin',
    techContactEmail: 'tech@example1.com',
    techContactPhone: '987-654-3210',
    createdAt: new Date('2022-10-04T00:00:00.000Z'),
    createdBy: 'Admin',
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

export const getMyOrganizationDetails = (): OrganizationDetailsDto => {
  const mdsId = getUserInfo().organizationMdsId;
  return getOrganizationDetails(mdsId);
};
