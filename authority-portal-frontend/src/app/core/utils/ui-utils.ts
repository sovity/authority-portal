import {OrganizationDetailResultRegistrationStatusEnum} from '@sovity.de/authority-portal-client';

export const getOrganizationRegistrationStatusClasses = (
  status: OrganizationDetailResultRegistrationStatusEnum,
): string => {
  switch (status) {
    case OrganizationDetailResultRegistrationStatusEnum.Approved:
      return 'text-emerald-700 bg-emerald-100/60';
    case OrganizationDetailResultRegistrationStatusEnum.Rejected:
      return 'text-red-700 bg-red-100/60';
    case OrganizationDetailResultRegistrationStatusEnum.Pending:
      return 'bg-gray-100/90';
    default:
      return '';
  }
};
