import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from 'src/app/core/utils/object-utils';

export let TEST_ORGANIZATIONS: OwnOrganizationDetailsDto[] = [
  {
    mdsId: 'MDSL1111AA',
    name: 'Dev Organization 1',
    address: '111 Main St, Anytown, USA',
    duns: '11-111-1111',
    registrationStatus: 'ACTIVE',
    url: 'https://example1.com',
    securityEmail: 'security@example1.com',
    createdAt: new Date('2023-08-05T00:00:00.000Z'),
    memberInfos: [],
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
    memberInfos: [],
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
    memberInfos: [],
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
    memberInfos: [],
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
    memberInfos: [],
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
    memberInfos: [],
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
    memberInfos: [],
  },
];

export const updateOrganization = (
  mdsId: string,
  patcher: Patcher<OwnOrganizationDetailsDto>,
) => {
  TEST_ORGANIZATIONS = TEST_ORGANIZATIONS.map((organization) => {
    return organization.mdsId === mdsId
      ? patchObj(organization, patcher)
      : organization;
  });
};
