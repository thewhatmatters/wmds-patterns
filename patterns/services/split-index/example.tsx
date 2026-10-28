/**
 * Example content for Services — Split Index. Each service's picture is a WMDS composition of what the service
 * delivers, set full-frame on one plain surface (no cards inside the frame): a live site, a type and colour
 * specimen, a reach chart, review stars, an inbox report, a care checklist. Licence-free and needs no
 * photography; a client page swaps in its own work.
 */
import type { ReactNode } from "react";
import { Badge, Button, ChartRankedBars, Status, TextLink } from "@thewhatmatters/wmds";
import { ServicesSplitIndex, type ServicesSplitIndexService } from "./ServicesSplitIndex";

export const meta = {
  type: "Services",
  name: "Services — Split Index",
  purpose: "Ruled services list beside a framed picture that follows the open service.",
};

/** One plain surface that fills the frame: no border, so it never reads as a card inside the frame's card. */
function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex size-full flex-col rounded-md bg-surface p-6 shadow-sm lg:p-8 ${className}`}>{children}</div>;
}

/** A faint text line, for page copy in the site picture. */
function Line({ w }: { w: string }) {
  return <span aria-hidden className={`block h-2 rounded-full bg-[color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] ${w}`} />;
}

const label = "font-mono text-xs uppercase tracking-[0.08em] text-muted";

/** A big figure set straight on the surface (WMDS Stat draws its own bordered box, which would nest). */
function Figure({ name, value, change, note }: { name: string; value: string; change?: string; note?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted type-supporting">{name}</span>
      <span className="flex items-center gap-3">
        <span className="type-display-2 leading-none tabular-nums text-fg">{value}</span>
        {change ? (
          <Badge size="sm" variant="success" emphasis="muted">
            {change}
          </Badge>
        ) : null}
      </span>
      {note ? <span className="text-muted type-supporting">{note}</span> : null}
    </div>
  );
}

function SiteVisual() {
  return (
    <Surface>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 font-mono text-xs text-muted">
          <Status variant="dot" tone="success" besideLabel />
          eastsidebakery.com
        </span>
        <Badge size="sm" emphasis="muted">
          Live
        </Badge>
      </div>
      <div className="mt-auto flex items-end justify-between gap-6">
        <Figure name="Page load" value="0.8s" change="-62%" note="vs the old site" />
        <div className="hidden w-2/5 flex-col gap-2.5 pb-2 sm:flex" aria-hidden>
          <Line w="w-full" />
          <Line w="w-4/5" />
          <Line w="w-3/5" />
        </div>
      </div>
    </Surface>
  );
}

function BrandVisual() {
  const swatches = ["--color-chart-categorical-1", "--color-chart-categorical-2", "--color-chart-categorical-3", "--color-chart-categorical-4"];
  return (
    <Surface>
      <div className="flex items-start justify-between gap-4">
        <span className="type-display-1 leading-none text-fg" aria-hidden="true">
          Aa
        </span>
        <span className={`${label} text-right`}>Display · Text · Mono</span>
      </div>
      <div className="mt-auto grid grid-cols-4 gap-2" aria-hidden="true">
        {swatches.map((token) => (
          <span key={token} className="aspect-[4/3] rounded-sm" style={{ background: `var(${token})` }} />
        ))}
      </div>
    </Surface>
  );
}

function SocialVisual() {
  return (
    <Surface className="justify-between">
      <p className={label}>Reach this month</p>
      <ChartRankedBars
        aria-label="Reach by platform this month"
        animate="none"
        // Pass max: WMDS 0.4.28 draws every bar at 100% without it (a WMDS bug, reported).
        max={20000}
        items={[
          { label: "Instagram", value: 18400, valueLabel: "18.4k" },
          { label: "TikTok", value: 12100, valueLabel: "12.1k" },
          { label: "Google", value: 6300, valueLabel: "6.3k" },
          { label: "Facebook", value: 2900, valueLabel: "2.9k" },
        ]}
      />
    </Surface>
  );
}

function SearchVisual() {
  return (
    <Surface className="justify-between">
      <p className={label}>Google Business profile</p>
      <div className="flex items-end justify-between gap-6">
        <Figure name="Rating" value="4.9" note="from 212 reviews" />
        <span className="pb-2 text-2xl tracking-[0.2em] text-[var(--color-chart-categorical-4)]" aria-hidden>
          ★★★★★
        </span>
      </div>
    </Surface>
  );
}

function EmailVisual() {
  return (
    <Surface className="justify-between">
      <p className={label}>Thursday newsletter</p>
      <div className="grid grid-cols-2 gap-6">
        <Figure name="Opened" value="58%" change="+9 pts" />
        <Figure name="Booked a table" value="41" note="this month" />
      </div>
    </Surface>
  );
}

function CareVisual() {
  const rows = [
    { label: "Uptime, 90 days", value: "99.98%" },
    { label: "Backups", value: "Daily" },
    { label: "Updates", value: "Tuesday" },
    { label: "Small changes", value: "2 left" },
  ];
  return (
    <Surface className="justify-center">
      <ul className="flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 py-3 type-large text-fg">
            <span className="flex items-center gap-3">
              <Status variant="dot" tone="success" besideLabel />
              {row.label}
            </span>
            <span className="font-mono tabular-nums text-muted">{row.value}</span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}

const services: ServicesSplitIndexService[] = [
  {
    title: "Websites",
    meta: "From 6 weeks",
    description: "A fast site you can edit yourself, built around the one thing you want visitors to do.",
    link: <TextLink href="#websites" className="inline-block -my-3 py-3">How we build sites</TextLink>,
    visual: <SiteVisual />,
  },
  {
    title: "Brand identity",
    meta: "From 4 weeks",
    description: "A name check, a logo, a colour and type system, and the files your printer and your team need.",
    link: <TextLink href="#brand" className="inline-block -my-3 py-3">See brand work</TextLink>,
    visual: <BrandVisual />,
  },
  {
    title: "Social and video",
    meta: "Monthly",
    description: "Short videos and posts shot in your space, planned a month ahead and reported on every month.",
    link: <TextLink href="#social" className="inline-block -my-3 py-3">How a month runs</TextLink>,
    visual: <SocialVisual />,
  },
  {
    title: "Local search",
    meta: "From 2 weeks",
    description: "Your Google profile, photos and reviews set up and kept fresh, so nearby customers find you first.",
    visual: <SearchVisual />,
  },
  {
    title: "Email",
    meta: "Monthly",
    description: "One short newsletter a week or a month, written with you and sent to the people who already like you.",
    visual: <EmailVisual />,
  },
  {
    title: "Care plan",
    meta: "Monthly",
    description: "Hosting, backups, updates and small changes, so the site stays fast and nobody has to think about it.",
    visual: <CareVisual />,
  },
];

export default function Example() {
  return (
    <ServicesSplitIndex
      heading="Everything a small business needs to be found, and chosen."
      intro="Six services, one team. Most clients start with one and add the rest when they're ready."
      actions={
        <Button role="outline" render={<a href="#contact" />}>
          Talk to us
        </Button>
      }
      services={services}
    />
  );
}
