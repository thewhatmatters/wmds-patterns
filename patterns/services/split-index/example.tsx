/**
 * Example content for Services — Split Index. Each service's picture is a small WMDS composition of what the
 * service delivers (a live site's speed, a type specimen, a reach chart, a care checklist), so the example is
 * licence-free and needs no photography; a client page swaps in its own work.
 */
import { Badge, Button, Card, ChartRankedBars, Stat, Status, TextLink } from "@thewhatmatters/wmds";
import { ServicesSplitIndex, type ServicesSplitIndexService } from "./ServicesSplitIndex";

export const meta = {
  type: "Services",
  name: "Services — Split Index",
  purpose: "Ruled services list beside a framed picture that follows the open service.",
};

const cardClasses = "w-full max-w-sm";

function SiteVisual() {
  return (
    <Card padding="none" className={cardClasses}>
      <Card.Header
        start={
          <span className="flex items-center gap-2 font-mono text-xs text-muted">
            <Status variant="dot" tone="success" besideLabel />
            eastsidebakery.com
          </span>
        }
        end={<Badge size="sm" emphasis="muted">Live</Badge>}
      />
      <Card.Body>
        <Stat label="Page load" value="0.8s" trend={{ value: "-62%", direction: "up" }} context="vs the old site" />
      </Card.Body>
    </Card>
  );
}

function BrandVisual() {
  const swatches = ["--color-chart-categorical-1", "--color-chart-categorical-2", "--color-chart-categorical-3", "--color-chart-categorical-4"];
  return (
    <Card padding="md" className={cardClasses}>
      <div className="flex items-end justify-between gap-4">
        <span className="type-display-1 leading-none text-fg" aria-hidden="true">
          Aa
        </span>
        <span className="pb-2 text-right font-mono text-xs uppercase tracking-wider text-muted">Display / Text / Mono</span>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden="true">
        {swatches.map((token) => (
          <span key={token} className="aspect-square rounded-md" style={{ background: `var(${token})` }} />
        ))}
      </div>
    </Card>
  );
}

function SocialVisual() {
  return (
    <Card padding="md" className={cardClasses}>
      <p className="pb-4 font-mono text-xs uppercase tracking-wider text-muted">Reach this month</p>
      <ChartRankedBars
        aria-label="Reach by platform this month"
        items={[
          { label: "Instagram", value: 18400, valueLabel: "18.4k" },
          { label: "TikTok", value: 12100, valueLabel: "12.1k" },
          { label: "Google", value: 6300, valueLabel: "6.3k" },
          { label: "Facebook", value: 2900, valueLabel: "2.9k" },
        ]}
      />
    </Card>
  );
}

function CareVisual() {
  const rows = [
    { label: "Uptime, 90 days", value: "99.98%" },
    { label: "Backups", value: "Daily" },
    { label: "Updates", value: "Tuesday" },
  ];
  return (
    <Card padding="md" className={cardClasses}>
      <ul className="flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <span className="flex items-center gap-2 text-fg">
              <Status variant="dot" tone="success" besideLabel />
              {row.label}
            </span>
            <span className="font-mono text-sm tabular-nums text-muted">{row.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const services: ServicesSplitIndexService[] = [
  {
    title: "Websites",
    meta: "From 6 weeks",
    description: "A fast site you can edit yourself, built around the one thing you want visitors to do.",
    link: <TextLink href="#websites">How we build sites</TextLink>,
    visual: <SiteVisual />,
  },
  {
    title: "Brand identity",
    meta: "From 4 weeks",
    description: "A name check, a logo, a colour and type system, and the files your printer and your team need.",
    link: <TextLink href="#brand">See brand work</TextLink>,
    visual: <BrandVisual />,
  },
  {
    title: "Social and video",
    meta: "Monthly",
    description: "Short videos and posts shot in your space, planned a month ahead and reported on every month.",
    link: <TextLink href="#social">How a month runs</TextLink>,
    visual: <SocialVisual />,
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
      intro="Four services, one team. Most clients start with one and add the rest when they're ready."
      actions={
        <Button role="secondary" render={<a href="#contact" />}>
          Talk to us
        </Button>
      }
      services={services}
    />
  );
}
