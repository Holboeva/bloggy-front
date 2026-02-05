/**
 * Returns 2-letter initials for avatars.
 * Prefers first name + last name; falls back to first 2 characters of username.
 */
export function getAvatarInitials(
  firstName?: string | null,
  lastName?: string | null,
  username?: string,
): string {
  const first = (firstName ?? "").trim();
  const last = (lastName ?? "").trim();
  if (first && last) {
    return (first[0]! + last[0]!).toUpperCase();
  }
  if (first) {
    return first.slice(0, 2).toUpperCase();
  }
  const un = (username ?? "").trim();
  if (un.length >= 2) {
    return un.slice(0, 2).toUpperCase();
  }
  return un.toUpperCase() || "??";
}
