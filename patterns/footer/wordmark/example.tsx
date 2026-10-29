/**
 * Example content for Footer — Wordmark. The tiles use WMDS chart colours; a client page uses its own
 * categories (services, menus, locations) and brand colours.
 */
import { useState } from "react";
import { FooterWordmark, type FooterWordmarkProps } from "./FooterWordmark";

export const meta = {
  type: "Footer",
  name: "Footer — Wordmark",
  purpose: "A dark newsletter card beside large link columns, coloured category tiles, and the brand name set edge to edge.",
};

export function FooterWordmarkExample(props: Partial<FooterWordmarkProps>) {
  const [status, setStatus] = useState<string>();
  return (
    <FooterWordmark
      pitch="One idea for your site in your inbox every Thursday."
      emailLabel="Email for the Thursday idea"
      onSubscribe={(email) => setStatus(`Thanks. The next one goes to ${email}.`)}
      status={status}
      columns={[
        { label: "Services", links: [{ label: "Websites", href: "#web" }, { label: "Video", href: "#video" }, { label: "Social", href: "#social" }, { label: "Pricing", href: "#pricing" }] },
        { label: "WhatMatters", links: [{ label: "About", href: "#about" }, { label: "Work", href: "#work" }, { label: "Journal", href: "#journal" }, { label: "Contact", href: "#contact" }] },
      ]}
      tiles={[
        { label: "Restaurants", href: "#food", color: "var(--color-chart-categorical-1)" },
        { label: "Retail", href: "#retail", color: "var(--color-chart-categorical-2)" },
        { label: "Health", href: "#health", color: "var(--color-chart-categorical-3)" },
        { label: "Home services", href: "#home", color: "var(--color-chart-categorical-4)" },
      ]}
      name="WhatMatters"
      copyright="© 2026 WhatMatters. Built in Austin."
      legal={[
        { label: "Terms", href: "#terms" },
        { label: "Privacy", href: "#privacy" },
        { label: "Accessibility", href: "#a11y" },
      ]}
      {...props}
    />
  );
}

export default FooterWordmarkExample;
