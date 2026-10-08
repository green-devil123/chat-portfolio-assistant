import contactData from '../../knowledge/contact.json';
import type { KnowledgeContact, KnowledgeContactLink } from '../../types/knowledge.ts';
import { ViewHeader } from './ViewHeader';

const contact = contactData as unknown as KnowledgeContact;

function ExternalIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 4.5h5.5V10" />
      <path d="M19.5 4.5 10.5 13.5" />
      <path d="M19.5 13.5v5a1.5 1.5 0 0 1-1.5 1.5h-12a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 6.5 5h5" />
    </svg>
  );
}

function DetailRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="eyebrow eyebrow--muted shrink-0 text-[0.68rem]">{label}</span>
      <span className="min-w-0 break-words text-right text-[1rem] text-ivory-dim">{value}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-baseline justify-between gap-3 border-b border-line-soft py-5 transition-colors hover:text-gold-bright sm:gap-6"
      >
        {content}
      </a>
    );
  }
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line-soft py-5 sm:gap-6">
      {content}
    </div>
  );
}

function LinkCard({ link }: { link: KnowledgeContactLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="surface group flex items-center justify-between gap-4 p-5"
    >
      <span>
        <span className="block text-[0.74rem] uppercase tracking-[0.22em] text-ivory-muted">
          Profile
        </span>
        <span className="display-md mt-1 block text-xl text-ivory transition-colors group-hover:text-gold-bright">
          {link.label}
        </span>
      </span>
      <ExternalIcon className="h-5 w-5 text-gold/85 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

export function ContactsView() {
  return (
    <div className="panel-scroll min-h-0 flex-1 px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-3xl pb-10">
        <ViewHeader
          eyebrow="Connect"
          title="Contacts"
          intro="Open to conversations around engineering, product development and generative AI."
        />

        <section aria-label="Contact details" className="mt-10 border-t border-line">
          <DetailRow label="Location" value={contact.location} />
          <DetailRow label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />
          <DetailRow label="Email" value={contact.email} href={`mailto:${contact.email}`} />
        </section>

        <section aria-label="Profiles" className="mt-10">
          <p className="eyebrow eyebrow--muted text-[0.68rem]">Profiles</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {contact.links.map((link) => (
              <LinkCard key={link.label} link={link} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}