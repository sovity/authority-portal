/**
 * Depending on the User we show either the registration process or the authority portal
 */
export type AuthorityPortalPageSet =
  | 'LOADING'
  | 'REGISTRATION_PROCESS'
  | 'AUTHORITY_PORTAL'
  | 'ONBOARDING_PROCESS';
