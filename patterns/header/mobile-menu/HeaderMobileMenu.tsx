/**
 * Header — Mobile Menu: the site header and its phone menu, after the Header and mobile menu rule
 * (Randy, 2026-10-28). WMDS `SiteNav` does the work: all links on desktop, a "☰ Menu" button below `md`
 * that becomes "✕ Close" in place and opens a full-height menu under the bar (56px rows, the main action
 * at the bottom), and the floating compact bar once the page scrolls.
 */
import type { ReactNode } from "react";
import { SiteNav } from "@thewhatmatters/wmds";

export interface HeaderMobileMenuLink {
  label: string;
  href: string;
  /** The page you're on: marked by the selected fill and `aria-current="page"`. */
  current?: boolean;
}

export interface HeaderMobileMenuProps {
  /** Slot: the brand, a WMDS `<SiteNav.Brand href="/">Name</SiteNav.Brand>` (a wordmark link that never underlines). */
  brand: ReactNode;
  /** The main links, key word first; 4 or fewer so they also show on tablets (5–7 at most on desktop). */
  links: HeaderMobileMenuLink[];
  /** Slot: the bar's main button, a WMDS `<Button size="sm">`. It stays in the bar on phones from 390 (N9) and gives way, by measurement, only when the bar can't fit it; `menuAction` carries it then. */
  action: ReactNode;
  /** Slot: the same action as a full-width WMDS `<Button>` at the bottom of the open menu. */
  menuAction: ReactNode;
  /** Slot, optional: a quieter link beside the main button on desktop (Sign in, Contact). */
  secondary?: ReactNode;
  /** `fixed` (default) is page chrome: in flow at the top, then the floating compact bar on scroll. */
  placement?: "fixed" | "inline";
  className?: string;
}

export function HeaderMobileMenu({ brand, links, action, menuAction, secondary, placement = "fixed", className }: HeaderMobileMenuProps) {
  return (
    <div data-pattern="header-mobile-menu" className={className}>
      <SiteNav
        placement={placement}
        start={<div data-slot="brand">{brand}</div>}
        middle={
          <SiteNav.Links>
            {links.map((link) => (
              <SiteNav.Link key={link.href} href={link.href} current={link.current}>
                {link.label}
              </SiteNav.Link>
            ))}
          </SiteNav.Links>
        }
        end={
          <div className="flex items-center gap-2" data-slot="action">
            {secondary != null ? <span className="max-md:hidden" data-slot="secondary" data-slot-optional="">{secondary}</span> : null}
            {action}
          </div>
        }
        mobile={links.map((link) => (
          <SiteNav.MobileLink key={link.href} href={link.href} current={link.current}>
            {link.label}
          </SiteNav.MobileLink>
        ))}
        mobileAction={<div data-slot="menuAction">{menuAction}</div>}
      />
    </div>
  );
}
