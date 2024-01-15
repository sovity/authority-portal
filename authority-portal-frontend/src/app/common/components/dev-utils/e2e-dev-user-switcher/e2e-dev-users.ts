import {E2eDevUser} from './e2e-dev-user';

export const E2E_DEV_USERS: E2eDevUser[] = [
  {
    user: '00000000-0000-0000-0000-00000001',
    password: '111',
    role: 'Authority Admin',
    organization: 'Company 1',
  },
  {
    user: '00000000-0000-0000-0000-00000002',
    password: '222',
    role: 'Authority User',
    organization: 'Company 1',
  },
  {
    user: '00000000-0000-0000-0000-00000003',
    password: '333',
    role: 'Participant Admin',
    organization: 'Company 2',
  },

  {
    user: '00000000-0000-0000-0000-00000004',
    password: '444',
    role: 'Participant User',
    organization: 'Company 2',
  },
  {
    user: '00000000-0000-0000-0000-00000005',
    password: '555',
    role: 'Pending User',
    organization: 'Company 3',
  },
  {
    user: '00000000-0000-0000-0000-00000006',
    password: '666',
    role: 'New User',
    organization: null,
  },
  {
    user: '00000000-0000-0000-0000-00000007',
    password: '777',
    role: 'Service Partner Admin',
    organization: 'Company 5',
  },
  {
    user: '00000000-0000-0000-0000-00000008',
    password: '888',
    role: 'Operator Admin',
    organization: 'Company 6',
  },
];
