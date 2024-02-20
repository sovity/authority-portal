/**
 * Depending on the User we show either the registration process or the authority portal
 */
export type AuthorityPortalPageSet =
  | 'LOADING'
  | 'UNAUTHENTICATED'
  | 'REJECTED'
  | 'PENDING'
  | 'AUTHORITY_PORTAL'
  | 'ONBOARDING_PROCESS';
