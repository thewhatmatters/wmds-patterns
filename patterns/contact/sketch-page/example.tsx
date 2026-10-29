/**
 * Example content for Contact — Sketch Page: the WhatMatters sketch request on its own page, with the
 * WMDS IntakeForm, a honeypot, the reply time under the button, and other ways to reach the team.
 */
import { useState, type FormEvent } from "react";
import {
  IntakeForm,
  IntakeHoneypot,
  intakeAboutEmpty,
  isIntakeAboutValid,
  type IntakeAboutValues,
} from "@thewhatmatters/wmds";
import { ContactSketchPage, type ContactSketchPageProps } from "./ContactSketchPage";

export const meta = {
  type: "Contact",
  name: "Contact — Sketch Page",
  purpose: "The sketch request as its own page: the form, the reply time, and other ways to reach the team beside it.",
};

export default function ContactSketchPageExample(props: Partial<ContactSketchPageProps>) {
  const [values, setValues] = useState<IntakeAboutValues>(intakeAboutEmpty);
  const [honeypot, setHoneypot] = useState("");
  const [submitCount, setSubmitCount] = useState(0);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isIntakeAboutValid(values)) {
      setSubmitCount((count) => count + 1);
      return;
    }
    // Post the answers here; the server drops the request when `honeypot` has a value.
  }

  return (
    <ContactSketchPage
      heading="Get a free sketch of your new site"
      intro="Tell us about your business. We’ll send a one-page sketch of what your site could be."
      fields={
        <>
          <IntakeForm values={values} onChange={setValues} submitCount={submitCount} />
          <IntakeHoneypot value={honeypot} onChange={setHoneypot} />
        </>
      }
      contact={{ phone: "(512) 555-0148", email: "hello@whatmatters.studio", hours: "Mon–Fri, 9–5 (Central)" }}
      onSubmit={submit}
      {...props}
    />
  );
}
