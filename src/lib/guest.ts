import { wedding } from '../config/wedding';

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

// "Dear" is a greeting style, not part of the name: the message already opens with "Dear".
export function buildDisplayName(prefix: Prefix, guestName: string): string {
  const name = guestName.trim().replace(/\s+/g, ' ');
  if (!name) return '';
  switch (prefix) {
    case 'Family':
      return `${name} and Family`;
    case 'Dear':
      return name;
    default:
      return `${prefix} ${name}`;
  }
}

export function buildInviteLink(displayName: string, baseUrl = window.location.origin): string {
  return `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${wedding.groomName} & ${wedding.brideName}`;
}

// Reads the guest display name from the first path segment, e.g. /Mr.%20Sanjaya
export function getGuestFromPath(pathname = window.location.pathname): string {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) return '';
  try {
    return decodeURIComponent(segment).replace(/[<>]/g, '').trim().slice(0, 80);
  } catch {
    return '';
  }
}
