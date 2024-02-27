import {UserDeletionCheck} from '@sovity.de/authority-portal-client';

export interface UserDeleteDialog {
  userId: string;
  userFullName: string;
  userOrganizationName: string;
  onDeleteSuccess: (data: UserDeletionCheck) => void;
}
