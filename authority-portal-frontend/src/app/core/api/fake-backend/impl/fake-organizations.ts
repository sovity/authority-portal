import {
  IdResponse,
  OrganizationDetailsDto,
  OrganizationOverviewEntryDto,
  OrganizationOverviewResult,
} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from 'src/app/core/utils/object-utils';

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
    address: '111 Main St, Anytown, USA',
    duns: '11-111-1111',
    registrationStatus: 'ACTIVE',
    url: 'https://example1.com',
    securityEmail: 'security@example1.com',
    createdAt: new Date('2023-08-05T00:00:00.000Z'),
    memberInfos: [
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
      },
      {
        userId: '00000000-0000-0000-0000-00000002',
        firstName: 'Authority',
        lastName: 'User',
        roles: ['AUTHORITY_USER', 'PARTICIPANT_USER'],
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
  },

  {
    mdsId: 'MDSL2222BB',
    name: 'Dev Organization 2',
    address: '222 Main St, Anytown, USA',
    duns: '22-222-2222',
    registrationStatus: 'ACTIVE',
    url: 'https://example2.com',
    securityEmail: 'security@example2.com',
    createdAt: new Date('2023-08-06T00:00:00.000Z'),
    memberInfos: [
      {
        userId: '00000000-0000-0000-0000-00000003',
        firstName: 'Participant',
        lastName: 'Admin',
        roles: ['PARTICIPANT_ADMIN', 'PARTICIPANT_CURATOR', 'PARTICIPANT_USER'],
      },
      {
        userId: '00000000-0000-0000-0000-00000004',
        firstName: 'Participant',
        lastName: 'User',
        roles: ['PARTICIPANT_USER'],
      },
    ],
    memberCount: 2,
    connectorCount: 3,
    dataOfferCount: 0,
  },
  {
    mdsId: 'MDSL3333CC',
    name: 'Test Orga',
    address: 'Gross Str 1, 11223 Test City',
    duns: '11-222-3333',
    registrationStatus: 'PENDING',
    url: 'https://www.test.org',
    securityEmail: 'security@test.org',
    createdAt: new Date('2023-08-01T00:00:00.000Z'),
    memberInfos: [
      {
        userId: '00000000-0000-0000-0000-00000012',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['PARTICIPANT_ADMIN'],
      },
      {
        userId: '00000000-0000-0000-0000-00000013',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
  },

  {
    mdsId: 'MDSL3331C1',
    name: 'Dev Organization 3.1',
    address: '331 Main St, Anytown, USA',
    duns: '33-333-3331',
    registrationStatus: 'PENDING',
    url: 'https://example31.com',
    securityEmail: 'security@example31.com',
    createdAt: new Date('2022-10-01T00:00:00.000Z'),
    memberInfos: [
      {
        userId: '00000000-0000-0000-0000-00000022',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['PARTICIPANT_ADMIN'],
      },
      {
        userId: '00000000-0000-0000-0000-00000023',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
  },
  {
    mdsId: 'MDSL3332C2',
    name: 'Dev Organization 3.2',
    address: '332 Main St, Anytown, USA',
    duns: '33-333-3332',
    registrationStatus: 'PENDING',
    url: 'https://example32.com',
    securityEmail: 'security@example32.com',
    createdAt: new Date('2022-10-02T00:00:00.000Z'),
    memberInfos: [
      {
        userId: '00000000-0000-0000-0000-00000032',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['PARTICIPANT_ADMIN'],
      },
      {
        userId: '00000000-0000-0000-0000-00000033',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
  },
  {
    mdsId: 'MDSL3333C3',
    name: 'Dev Organization 3.3',
    address: '334 Main St, Anytown, USA',
    duns: '33-333-3334',
    registrationStatus: 'PENDING',
    url: 'https://example33.com',
    securityEmail: 'security@example33.com',
    createdAt: new Date('2022-10-03T00:00:00.000Z'),
    memberInfos: [
      {
        userId: '00000000-0000-0000-0000-00000042',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['PARTICIPANT_ADMIN'],
      },
      {
        userId: '00000000-0000-0000-0000-00000043',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
  },
  {
    mdsId: 'MDSL3334C4',
    name: 'Dev Organization 3.4',
    address: '335 Main St, Anytown, USA',
    duns: '33-333-3335',
    registrationStatus: 'PENDING',
    url: 'https://example34.com',
    securityEmail: 'security@example34.com',
    createdAt: new Date('2022-10-04T00:00:00.000Z'),
    memberInfos: [
      {
        userId: '00000000-0000-0000-0000-00000052',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['PARTICIPANT_ADMIN'],
      },
      {
        userId: '00000000-0000-0000-0000-00000053',
        firstName: 'Jack',
        lastName: 'Doe',
        roles: ['PARTICIPANT_USER'],
      },
    ],
    memberCount: 2,
    connectorCount: 1,
    dataOfferCount: 0,
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
            registrationStatus: organization.registrationStatus,
            url: organization.url,
          } satisfies OrganizationOverviewEntryDto;
        },
      ),
    };
  };
