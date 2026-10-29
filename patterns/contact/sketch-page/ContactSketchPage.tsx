import type { FormEvent, ReactNode } from "react";
import { Button, TextLink, cn } from "@thewhatmatters/wmds";

export interface ContactSketchPageContact {
  /** Shown as written, dialled as `tel:`. */
  phone?: string;
  email?: string;
  /** e.g. "Mon–Fri, 9–5 (Central)". */
  hours?: string;
}

export interface ContactSketchPageProps {
  /** The page's one `h1`. */
  heading: ReactNode;
  /** A sentence under the heading: what they'll get. */
  intro?: ReactNode;
  /** The fields: a WMDS `IntakeForm` (or Inputs in Fields) plus a WMDS `IntakeHoneypot`. */
  fields: ReactNode;
  /** Says what happens (Contact and booking forms T5). Never "Submit". */
  submitLabel?: string;
  /** When you'll reply, under the button (T2). Keep it true. */
  replyTime?: ReactNode;
  /** A failed send (T6): say what happened, that the answers are kept, and give the email route. */
  error?: ReactNode;
  /** Other ways to reach you (T1): beside the form on desktop, below it on phones. */
  contact?: ContactSketchPageContact;
  /** Heading over the contact details. Default "Prefer to talk?". */
  contactHeading?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

/** Full width on the WMDS page grid; 48px top and bottom on phones, 4rem from md (Spacing S8). */
const sectionClasses = "grid-page !py-12 md:!py-16";
const mainClasses = "col-span-full flex flex-col gap-8 md:col-span-6 lg:col-span-7";
const headingClasses = "text-balance type-heading-1 text-fg";
const introClasses = "mt-3 max-w-[40ch] text-pretty type-lead text-fg";
const formClasses = "relative flex flex-col gap-6";
const actionsClasses = "flex flex-col items-start gap-3";
const replyClasses = "type-supporting text-muted";
const errorClasses = "rounded-[var(--radius-card-shell)] bg-error-muted p-4 type-body text-error";
/** Below the form on phones, beside it from md, starting on the same row as the heading. */
const asideClasses =
  "col-span-full mt-12 flex min-w-0 flex-col gap-3 border-t border-border pt-8 md:col-span-2 md:col-start-7 md:row-start-1 md:mt-0 md:border-t-0 md:border-l md:pt-0 md:pl-6 lg:col-span-4 lg:col-start-9";
const asideHeadingClasses = "type-heading-5 text-fg";
/** min-w-0: the list may shrink to the aside's two md columns instead of pushing past the page. */
const asideListClasses = "flex min-w-0 flex-col gap-2 type-body text-fg";
/** An email address breaks only before its "@" ("hello" / "@whatmatters.studio"), as in Footer — Over Image; anywhere only if one half still won't fit. */
const emailClasses = "[overflow-wrap:anywhere]";

/** Puts a line-break opportunity before the "@" of an email address. */
function emailLabel(email: string) {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}

/**
 * Contact — Sketch Page: the sketch request as its own page (Contact and booking forms T9). The nav and
 * hero can still open it as a modal shortcut (WMDS `IntakeModal` + `useIntakeUrlState`).
 */
export function ContactSketchPage({
  heading,
  intro,
  fields,
  submitLabel = "Send my request",
  replyTime = "We reply within one business day.",
  error,
  contact,
  contactHeading = "Prefer to talk?",
  onSubmit,
  className,
}: ContactSketchPageProps) {
  return (
    <section className={cn(sectionClasses, className)} data-pattern="contact-sketch-page">
      <div className={mainClasses}>
        <div>
          <h1 className={headingClasses}>{heading}</h1>
          {intro != null ? <p className={introClasses}>{intro}</p> : null}
        </div>
        <form className={formClasses} onSubmit={onSubmit} noValidate>
          {error != null ? (
            <div role="alert" className={errorClasses}>
              {error}
            </div>
          ) : null}
          {fields}
          <div className={actionsClasses}>
            <Button role="primary" size="lg" type="submit">
              {submitLabel}
            </Button>
            {replyTime != null ? <p className={replyClasses}>{replyTime}</p> : null}
          </div>
        </form>
      </div>
      {contact != null ? (
        <aside className={asideClasses} aria-labelledby="contact-sketch-page-talk">
          <h2 id="contact-sketch-page-talk" className={asideHeadingClasses}>
            {contactHeading}
          </h2>
          <ul className={asideListClasses}>
            {contact.phone != null ? (
              <li>
                <TextLink href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>{contact.phone}</TextLink>
              </li>
            ) : null}
            {contact.email != null ? (
              <li>
                <TextLink href={`mailto:${contact.email}`} className={emailClasses}>
                  {emailLabel(contact.email)}
                </TextLink>
              </li>
            ) : null}
            {contact.hours != null ? <li className="text-muted">{contact.hours}</li> : null}
          </ul>
        </aside>
      ) : null}
    </section>
  );
}
