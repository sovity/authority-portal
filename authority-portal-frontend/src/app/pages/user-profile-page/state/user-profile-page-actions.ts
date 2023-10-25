const tag = 'UserProfilePage';

export class RefreshUserProfile {
  static readonly type = `[${tag}] Refresh User profile`;
  constructor(public userId: string) {}
}
