// A short, human-readable badge code derived from the attendee's
// account id — stable for a given person, shown at check-in and
// encoded in their QR code.
export function badgeCode(userId) {
  if (!userId) return '';
  const hex = userId.replace(/-/g, '').slice(0, 6).toUpperCase();
  return `CWOC-2026-${hex}`;
}
