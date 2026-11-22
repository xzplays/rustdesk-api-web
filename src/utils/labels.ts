const REASON_KEYS: Record<string, string> = {
  ok: 'audit.reasonOk',
  'token is empty': 'audit.reasonTokenEmpty',
  'token not found': 'audit.reasonTokenNotFound',
  'token expired': 'audit.reasonTokenExpired',
  'user not found': 'audit.reasonUserNotFound',
  'user disabled': 'audit.reasonUserDisabled',
};

export const AUDIT_REASONS = Object.keys(REASON_KEYS);

export function reasonLabel(reason: string | undefined | null, t: (key: string) => string) {
  if (!reason) return '-';
  const key = REASON_KEYS[reason];
  return key ? t(key) : reason;
}
