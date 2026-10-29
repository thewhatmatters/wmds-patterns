/**
 * Example content for Header — Mobile Menu: a WhatMatters-style site header over a placeholder page tall
 * enough to scroll, so the compact bar shows. Replace the links, brand and action with the site's own.
 */
import { Button, SiteNav } from "@thewhatmatters/wmds";
import { HeaderMobileMenu, type HeaderMobileMenuProps } from "./HeaderMobileMenu";

export const meta = {
  type: "Header",
  name: "Header — Mobile Menu",
  purpose: "The site header with all links on desktop, a Menu button and full-height menu on phones, and a compact bar on scroll.",
};

export function HeaderMobileMenuExample(props: Partial<HeaderMobileMenuProps>) {
  return (
    <>
      <HeaderMobileMenu
        brand={<SiteNav.Brand href="#home">WhatMatters</SiteNav.Brand>}
        links={[
          { label: "Services", href: "#services", current: true },
          { label: "Work", href: "#work" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ]}
        secondary={
          <Button role="ghost" size="sm" render={<a href="#signin" />}>
            Sign in
          </Button>
        }
        action={
          <Button role="primary" size="sm" render={<a href="#sketch" />} className="whitespace-nowrap">
            Get my free sketch
          </Button>
        }
        menuAction={
          <Button role="primary" size="lg" render={<a href="#sketch" />}>
            Get my free sketch
          </Button>
        }
        {...props}
      />
      {/* Placeholder page: tall enough to scroll, so the compact bar shows. */}
      <main className="grid-page">
        <div className="col-span-full h-[160vh] rounded-[var(--radius-surface)] border border-dashed border-border" aria-hidden />
      </main>
    </>
  );
}

export default HeaderMobileMenuExample;
