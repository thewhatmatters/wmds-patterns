/**
 * Example content for Signup — Inline Field: a studio's monthly newsletter. The example pretends to store the
 * address (a short wait, then done; "fail@example.com" shows the error state), so it sends nothing anywhere.
 */
import { TextLink } from "@thewhatmatters/wmds";
import { SignupInlineField, type SignupInlineFieldProps } from "./SignupInlineField";

export const meta = {
  type: "Signup",
  name: "Signup — Inline Field",
  purpose: "One big line and one email field on a row, Enter to send, with sending, done and error states.",
};

const pretendSubscribe = (email: string) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => (email.startsWith("fail@") ? reject(new Error("That address bounced before. Try another one.")) : resolve()), 700),
  );

export default function Example(props: Partial<SignupInlineFieldProps>) {
  return (
    <SignupInlineField
      eyebrow="Newsletter"
      heading="One useful email a month."
      note={
        <>
          What we built, what it cost and what we'd do differently. No spam; leave any time. <TextLink href="#privacy">How we use your address</TextLink>
        </>
      }
      submitLabel="Subscribe"
      doneMessage="You're in. The next one lands on the 1st."
      onSubscribe={pretendSubscribe}
      {...props}
    />
  );
}
