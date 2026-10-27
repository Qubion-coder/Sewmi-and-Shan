const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx_iETp2Mj3jJMeZOJXTd1nm3H-Azvlzy3vAFDWUo60QZ3E57qEVm0AnNgj6SRpz4XP/exec';

const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || DEFAULT_SCRIPT_URL;

export interface SheetWish {
  name: string;
  message: string;
  createdAt: string;
}

interface ScriptResponse<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

function requireUrl(): string {
  if (!scriptUrl) throw new Error('VITE_GOOGLE_APPS_SCRIPT_URL is not configured.');
  return scriptUrl;
}

// URL-encoded body keeps this a "simple" CORS request, so Apps Script needs no preflight.
async function post(fields: Record<string, string>): Promise<void> {
  const res = await fetch(requireUrl(), {
    method: 'POST',
    body: new URLSearchParams(fields),
  });
  const json = (await res.json()) as ScriptResponse;
  if (!json.ok) throw new Error(json.error || 'Request failed');
}

export function submitRsvp(data: {
  name: string;
  attendance: string;
  guests: string;
  dietaryNotes: string;
  invitedAs: string;
}) {
  return post({ action: 'rsvp', ...data });
}

export function submitWish(data: { name: string; message: string; invitedAs: string }) {
  return post({ action: 'wish', ...data });
}

export async function fetchWishes(): Promise<SheetWish[]> {
  const res = await fetch(`${requireUrl()}?action=wishes`);
  const json = (await res.json()) as ScriptResponse<SheetWish[]>;
  if (!json.ok) throw new Error(json.error || 'Could not load wishes');
  return json.data ?? [];
}
