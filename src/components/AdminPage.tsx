import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Link2, Copy, MessageCircle, Heart } from 'lucide-react';
import { wedding } from '../config/wedding';
import { PREFIXES, Prefix, buildDisplayName, buildInviteLink, buildInviteMessage } from '../lib/guest';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for non-secure contexts (e.g. testing over LAN IP)
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

export const AdminPage: React.FC = () => {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ displayName: string; link: string; message: string } | null>(null);

  useEffect(() => {
    document.title = `Invitation Links | ${wedding.brideName} & ${wedding.groomName}`;
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      toast.error('Please enter a guest name.');
      return;
    }
    const link = buildInviteLink(displayName);
    setGenerated({ displayName, link, message: buildInviteMessage(displayName, link) });
  };

  const handleCopy = async (text: string, label: string) => {
    await copyText(text);
    toast.success(label);
  };

  const labelClass = 'block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2 ml-2';
  const inputClass =
    'w-full bg-white px-5 py-3 rounded-full border border-stone-200 focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-mocha/40 outline-none transition-all font-serif text-lg text-brand-mocha';
  const buttonClass =
    'flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-champagne font-sans text-brand-mocha px-4 py-10 sm:py-16">
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <Heart className="w-6 h-6 mx-auto mb-4 text-brand-gold fill-brand-gold/20" />
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
            {wedding.brideName} & {wedding.groomName}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-sand mt-3">
            Invitation Link Generator
          </p>
        </header>

        <form
          onSubmit={handleGenerate}
          className="bg-white/80 rounded-[2rem] border border-brand-gold/30 shadow-[0_20px_50px_rgba(197,160,89,0.12)] p-6 sm:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5">
            <div>
              <label htmlFor="prefix" className={labelClass}>Prefix</label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as Prefix)}
                className={`${inputClass} cursor-pointer`}
              >
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="guestName" className={labelClass}>Guest Name</label>
              <input
                id="guestName"
                type="text"
                placeholder="e.g. Sanjaya"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={inputClass}
                autoComplete="off"
              />
            </div>
          </div>

          <p className="text-sm font-serif italic text-brand-sand ml-2">
            Greeting preview:{' '}
            <span className="not-italic font-semibold text-brand-mocha">
              Dear {buildDisplayName(prefix, guestName) || '…'} ❤️
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className={`${buttonClass} bg-brand-mocha text-brand-champagne hover:bg-brand-mocha/90 shadow-lg`}>
              <Link2 className="w-4 h-4 text-brand-gold" />
              Generate Link
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.link, 'Link copied!')}
              className={`${buttonClass} border border-brand-gold/50 hover:bg-brand-gold/10`}
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.message, 'Message copied!')}
              className={`${buttonClass} border border-brand-gold/50 hover:bg-brand-gold/10`}
            >
              <MessageCircle className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>
        </form>

        {generated && (
          <section className="mt-8 bg-white/80 rounded-[2rem] border border-brand-gold/30 p-6 sm:p-10 space-y-6">
            <div>
              <p className={labelClass}>Generated Link</p>
              <a
                href={generated.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all bg-brand-champagne rounded-2xl px-5 py-3 font-mono text-sm text-brand-sand hover:underline"
              >
                {generated.link}
              </a>
            </div>
            <div>
              <p className={labelClass}>Message Preview</p>
              <pre className="whitespace-pre-wrap break-words bg-brand-champagne rounded-2xl px-5 py-4 font-serif text-base leading-relaxed text-brand-mocha">
                {generated.message}
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
