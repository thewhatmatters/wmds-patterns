/**
 * Signup — Inline Field: one big line and one email field, for a newsletter, a waitlist or "send me the guide"
 * (after Plnty's "Join early & claim"). The field and its button sit on one row; Enter submits; a short line under
 * it says what people get and how often. Plain and content-led: the only change on screen is the form's own state
 * (sending, done, or a message to fix the address).
 *
 * The pattern doesn't send anything itself: pass `onSubscribe`, which receives the address and resolves when it's
 * stored (or throws with a message to show).
 */
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Band, Button, Input, Kbd, cn, type BandTone } from "@thewhatmatters/wmds";

export interface SignupInlineFieldProps {
  /** Optional: a short label above the heading, e.g. "Newsletter". */
  eyebrow?: ReactNode;
  /** The line: what they're signing up for, short. "One useful email a month." */
  heading: ReactNode;
  /** What they get and how often, one sentence under the field. May hold a privacy link. */
  note?: ReactNode;
  /** The button's label, a verb: "Subscribe", "Join the waitlist". */
  submitLabel?: string;
  /** Shown in place of the form once it's done: "You're in. The next one lands on the 1st." */
  doneMessage?: ReactNode;
  /** Stores the address. Resolve when it's stored; throw an Error whose message is shown under the field. */
  onSubscribe: (email: string) => Promise<void>;
  /** The WMDS Band tone. Default `default`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Centred on the middle 6 columns from lg (Grid rule: a centred lead takes columns 4–9); full width below. */
const innerClasses = "col-span-full flex flex-col items-start lg:col-span-6 lg:col-start-4 lg:items-center lg:text-center";
const headingClasses = "text-balance type-heading-1 text-fg";
/**
 * Field and button on one row from md; stacked full width on phones. The row aligns to the top and the button
 * drops by the label's height (24px), so it stays level with the field when an error band opens under it.
 */
const formClasses = "mt-8 flex w-full flex-col gap-3 text-left md:flex-row md:items-start";
const noteClasses = "mt-4 text-pretty text-muted";
const hintClasses = "mt-3 hidden items-center gap-2 text-muted md:flex";

/** A light check, not a full validator: the server has the last word. */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function SignupInlineField({
  eyebrow,
  heading,
  note,
  submitLabel = "Subscribe",
  doneMessage = "You're in. Check your inbox to confirm.",
  onSubscribe,
  tone = "default",
  className,
}: SignupInlineFieldProps) {
  const headingId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;
    if (!looksLikeEmail(email)) {
      setError("Enter an email address, like name@example.com.");
      return;
    }
    setError(null);
    setState("sending");
    try {
      await onSubscribe(email.trim());
      setState("done");
    } catch (reason) {
      setState("idle");
      setError(reason instanceof Error && reason.message ? reason.message : "That didn't go through. Try again in a moment.");
    }
  };

  return (
    <div className={cn("relative w-full", className)} data-pattern="signup-inline-field">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={headingId}>
        <div className={innerClasses}>
          {eyebrow != null ? (
            // Tight to the heading (12px, Eyebrow E5).
            <p className="mb-3 type-eyebrow text-muted" data-slot="eyebrow" data-slot-optional="">
              {eyebrow}
            </p>
          ) : null}
          <h2 id={headingId} className={headingClasses} data-slot="heading">
            {heading}
          </h2>

          {state === "done" ? (
            <p className="mt-8 type-lead text-fg" role="status" data-slot="done">
              {doneMessage}
            </p>
          ) : (
            <>
              <form className={formClasses} onSubmit={submit} noValidate aria-labelledby={headingId} data-slot="form">
                <Input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  size="lg"
                  width="full"
                  label="Email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(null);
                  }}
                  status={error ? "error" : undefined}
                  message={error ?? undefined}
                  disabled={state === "sending"}
                  className="md:flex-1"
                />
                <Button role="primary" size="lg" type="submit" status={state === "sending" ? "loading" : "idle"} statusLabels={{ loading: "Sending…" }} className="shrink-0 md:mt-6">
                  {submitLabel}
                </Button>
              </form>
              <p className={hintClasses} aria-hidden>
                Press <Kbd size="sm">Enter</Kbd> to send
              </p>
            </>
          )}

          {note != null ? (
            <p className={noteClasses} data-slot="note" data-slot-optional="">
              {note}
            </p>
          ) : null}
        </div>
      </Band>
    </div>
  );
}
