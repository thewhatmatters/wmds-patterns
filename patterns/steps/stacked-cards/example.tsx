/**
 * Example content for Steps — Stacked Cards: how a studio project runs, four steps. Each step's picture is a
 * small WMDS composition of what it produces (licence-free); a client page uses its own screens or photos.
 */
import type { ReactNode } from "react";
import { Card, ChartRankedBars, Stat, Status } from "@thewhatmatters/wmds";
import { StepsStackedCards, type StepsStackedCardsProps, type StepsStackedCardsStep } from "./StepsStackedCards";

export const meta = {
  type: "Steps",
  name: "Steps — Stacked Cards",
  purpose: "A how-it-works section where each step's card sticks and the next slides over it, leaving a strip of each.",
  /** Moves as the page scrolls: the gallery shows it a screen tall and scrolls inside the frame. */
  scroll: true,
};

/** A paper card in the visual area, so each picture reads the same on every card tone. */
function Panel({ children }: { children: ReactNode }) {
  return (
    <Card tone="light" padding="md" className="w-full max-w-sm">
      {children}
    </Card>
  );
}

const rows = [
  { label: "Home page", tone: "success" as const, state: "Done" },
  { label: "Booking flow", tone: "warning" as const, state: "In review" },
  { label: "Menu", tone: "neutral" as const, state: "Next" },
];

const steps: StepsStackedCardsStep[] = [
  {
    title: "We talk",
    meta: "Day 1",
    description: "A 30-minute call about what you sell, who buys it and what the site has to do. No deck, no homework.",
    visual: (
      <Panel>
        <Stat label="First call" value="30 min" context="Free, on your schedule" />
      </Panel>
    ),
  },
  {
    title: "You get a plan and a price",
    meta: "Day 2",
    description: "One page: what we'll build, in what order, by when, for a fixed price. Nothing starts until you say yes.",
    visual: (
      <Panel>
        <p className="pb-4 type-eyebrow text-muted">Weeks by phase</p>
        <ChartRankedBars
          aria-label="Weeks by phase"
          max={3}
          items={[
            { label: "Build", value: 3, valueLabel: "3 weeks" },
            { label: "Design", value: 2, valueLabel: "2 weeks" },
            { label: "Launch", value: 1, valueLabel: "1 week" },
          ]}
        />
      </Panel>
    ),
  },
  {
    title: "We build it with you",
    meta: "Weeks 1–5",
    description: "You see real pages from the first week, comment on them as they grow, and always know what's next.",
    visual: (
      <Panel>
        <ul className="flex flex-col divide-y divide-border">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <span className="flex items-center gap-2 text-fg">
                <Status variant="dot" tone={row.tone} besideLabel />
                {row.label}
              </span>
              <span className="text-muted">{row.state}</span>
            </li>
          ))}
        </ul>
      </Panel>
    ),
  },
  {
    title: "You launch",
    meta: "Week 6",
    description: "We put it live, show you how to change it yourself, and stay on call for the first month.",
    visual: (
      <Panel>
        <p className="flex items-center gap-2 pb-4 font-mono text-fg">
          <Status variant="dot" tone="success" besideLabel />
          eastsidebakery.com
        </p>
        <Stat label="Page load" value="0.8s" context="On a phone, on 4G" />
      </Panel>
    ),
  },
];

export default function Example(props: Partial<StepsStackedCardsProps>) {
  return (
    <StepsStackedCards
      eyebrow="How it works"
      heading="From first call to launch in six weeks."
      intro="Four steps, one team, a fixed price. You always know what's happening and what's next."
      steps={steps}
      {...props}
    />
  );
}
