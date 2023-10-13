import {UserInfo} from '@sovity.de/authority-portal-client';

export let TEST_USERS: {[key: string]: UserInfo} = {
  '00000000-0000-0000-0000-00000001': {
    firstName: 'Authority',
    lastName: 'Admin',
    roles: [
      'AUTHORITY_ADMIN',
      'AUTHORITY_USER',
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_USER',
    ],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-00000002': {
    firstName: 'Authority',
    lastName: 'User',
    roles: ['AUTHORITY_USER', 'PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-00000003': {
    firstName: 'Participant',
    lastName: 'Admin',
    roles: ['PARTICIPANT_ADMIN', 'PARTICIPANT_CURATOR', 'PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-00000004': {
    firstName: 'Participant',
    lastName: 'User',
    roles: ['PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-00000005': {
    firstName: 'Created',
    lastName: 'User',
    roles: [],
    registrationStatus: 'CREATED',
    organizationName: '',
    organizationMdsId: '',
  },
  '00000000-0000-0000-0000-00000006': {
    firstName: 'Pending',
    lastName: 'User',
    roles: [],
    registrationStatus: 'PENDING',
    organizationName: '',
    organizationMdsId: 'MDSL5555EE',
  },
};
