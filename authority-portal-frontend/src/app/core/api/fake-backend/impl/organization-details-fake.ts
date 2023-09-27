import {
  ApproveOrganizationRequest,
  IdResponse,
  OrganizationDetailResult,
} from '@sovity.de/authority-portal-client';

export const getOrganizationDetails = (
  mdsId: string,
): OrganizationDetailResult => {
  return {
    mdsId: '123',
    name: 'Test Orga',
    address: '11223',
    duns: '11-222-3333',
    registrationStatus: 'PENDING',
    url: 'https://www.test.org',
    securityEmail: 'security@test.org',
  };
};

export const approveOrganization = (
  request: ApproveOrganizationRequest,
): IdResponse => {
  // TODO
  return {id: 'test-organization-id', changedDate: new Date()};
};
