/**
 * Pricing — Ruled Table: one ruled grid where the packages head the columns and the comparison rows run under
 * them in the same columns, with a toggle between paying once and spreading the cost monthly (after Heron AI's
 * pricing; Randy, 2026-11-06: the packages must line up with the table they belong to). Built for service businesses
 * that sell fixed-price packages rather than subscriptions.
 *
 * From md it's one WMDS `Table` (`rules="grid"`, equal columns from a `colgroup`): an empty corner over the feature
 * names, then a `TableHead wrap` per package. Phones can't fit the columns, so they get the packages stacked as
 * ruled cells and the comparison as a scrolling table below.
 *
 * Motion (motion.dev, `motion/react`, the WMDS peer): when the toggle changes, each price slides up into place over
 * 200ms (transform and opacity). Under reduced motion the prices simply change.
 */
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Badge, Band, SegmentedControl, Status, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn, type BandTone } from "@thewhatmatters/wmds";

export interface PricingRuledTableTier {
  /** The package's name: "Starter site". */
  name: string;
  /** Who it's for, one line. */
  description: ReactNode;
  /** The price paid once, e.g. 6800. `null` for a price on request ("Custom"). */
  price: number | null;
  /** Slot: the package's CTA, a WMDS `<Button size="lg">` (primary on the picked tier, outline on the rest). */
  action: ReactNode;
  /** Optional: a short badge, e.g. "Most picked". One tier at most. */
  badge?: ReactNode;
}

export interface PricingRuledTableRow {
  /** The feature, short: "Pages". */
  feature: string;
  /** One value per tier, in tier order: `true` included, `false` not, or a short text ("Up to 8"). */
  values: (boolean | string)[];
}

export interface PricingRuledTableProps {
  /** Optional: a short label above the heading, e.g. "Pricing". */
  eyebrow?: ReactNode;
  /** The section's heading, one short line. */
  heading: ReactNode;
  /** Optional: a sentence beside the heading. */
  intro?: ReactNode;
  /** 2–4 packages. */
  tiers: PricingRuledTableTier[];
  /** Optional: the comparison rows under the packages. */
  rows?: PricingRuledTableRow[];
  /** Months the monthly option spreads the price over. Default 12. */
  months?: number;
  /** Added to the price when it's spread monthly, as a fraction (0.05 = 5%). Default 0.05. */
  monthlyFee?: number;
  /** ISO currency for the prices. Default "USD". */
  currency?: string;
  /** The WMDS Band tone. Default `default`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

const headerClasses = "col-span-full lg:col-span-6";
const headingClasses = "text-balance type-heading-1 text-fg";
/** Intro and toggle start where the second half starts (column 7, Grid rule). */
const asideClasses = "col-span-full mt-4 flex flex-col items-start gap-6 md:mt-6 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-end";
/** Phones: the packages stacked as ruled cells that share their rules. */
const tiersClasses = "col-span-full mt-10 grid border-l border-t border-border md:hidden";
const tierClasses = "flex flex-col gap-6 border-b border-r border-border p-6";
/** From md: the one grid, packages heading the columns. */
const gridClasses = "col-span-full mt-16 hidden md:block";
const priceRowClasses = "flex min-h-14 items-baseline gap-2 overflow-hidden";
const priceClasses = "type-display-3 tabular-nums text-fg";
const priceNoteClasses = "text-muted";
/** Phones: the comparison under the stacked packages. */
const tableWrapClasses = "col-span-full mt-10 md:hidden";

function useMoney(currency: string) {
  const format = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });
  return (value: number) => format.format(value);
}

function Included({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-fg">{value}</span>;
  return value ? (
    <span className="inline-flex items-center gap-2 text-fg">
      <Status variant="dot" tone="success" besideLabel />
      Included
    </span>
  ) : (
    <span className="text-muted">
      <span aria-hidden>—</span>
      <span className="sr-only">Not included</span>
    </span>
  );
}

/** One package: name (and badge), who it's for, the price that slides when the plan changes, how it's paid, the CTA. */
function Package({
  tier,
  plan,
  months,
  monthlyFee,
  money,
  reduce,
}: {
  tier: PricingRuledTableTier;
  plan: "once" | "monthly";
  months: number;
  monthlyFee: number;
  money: (value: number) => string;
  reduce: boolean | null;
}) {
  const monthly = tier.price == null ? null : Math.round((tier.price * (1 + monthlyFee)) / months);
  const shown = tier.price == null ? "Custom" : plan === "once" ? money(tier.price) : money(monthly ?? 0);
  return (
    <>
      <span className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="type-heading-3 text-fg">{tier.name}</h3>
        {tier.badge != null ? (
          <Badge size="sm" emphasis="muted">
            {tier.badge}
          </Badge>
        ) : null}
      </span>
      <span className="block text-pretty text-muted type-body">{tier.description}</span>
      <span className="block">
        <span className={priceRowClasses} aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shown}
              className={priceClasses}
              initial={reduce ? false : { y: "60%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { y: "-60%", opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {shown}
            </motion.span>
          </AnimatePresence>
          {tier.price != null && plan === "monthly" ? <span className={priceNoteClasses}>a month</span> : null}
        </span>
        <span className="mt-1 block text-muted type-body">
          {tier.price == null
            ? "Priced after the first call"
            : plan === "once"
              ? "One payment, in three stages"
              : `${months} payments, ${money((monthly ?? 0) * months)} in all`}
        </span>
      </span>
      <span className="mt-auto block [&>*]:w-full" data-slot="action">
        {tier.action}
      </span>
    </>
  );
}

export function PricingRuledTable({
  eyebrow,
  heading,
  intro,
  tiers,
  rows,
  months = 12,
  monthlyFee = 0.05,
  currency = "USD",
  tone = "default",
  className,
}: PricingRuledTableProps) {
  const headingId = useId();
  const [plan, setPlan] = useState<"once" | "monthly">("once");
  const reduce = useReducedMotion();
  const money = useMoney(currency);

  return (
    <div className={cn("relative w-full", className)} data-pattern="pricing-ruled-table">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={headingId}>
        <div className={headerClasses}>
          {eyebrow != null ? (
            // Tight to the heading (12px, Eyebrow E5).
            <p className="mb-3 type-eyebrow text-muted" data-slot="eyebrow" data-slot-optional="">
              {eyebrow}
            </p>
          ) : null}
          <h2 id={headingId} className={headingClasses} data-slot="heading">
            {heading}
          </h2>
        </div>
        <div className={asideClasses}>
          {intro != null ? (
            <p className="text-pretty text-fg type-lead" data-slot="intro" data-slot-optional="">
              {intro}
            </p>
          ) : null}
          <SegmentedControl aria-label="How you pay" value={plan} onValueChange={(value) => setPlan(value as "once" | "monthly")}>
            <SegmentedControl.Item value="once">Pay once</SegmentedControl.Item>
            <SegmentedControl.Item value="monthly">Spread over {months} months</SegmentedControl.Item>
          </SegmentedControl>
        </div>

        {/* Phones: the packages stacked. */}
        <ul className={tiersClasses} data-slot="tiers">
          {tiers.map((tier) => (
            <li key={tier.name} className={tierClasses}>
              <Package tier={tier} plan={plan} months={months} monthlyFee={monthlyFee} money={money} reduce={reduce} />
            </li>
          ))}
        </ul>

        {/* From md: one grid, the packages heading the columns the rows run under. */}
        <div className={gridClasses} data-slot="grid">
          <Table aria-label="Packages and what each includes" rules="grid">
            <colgroup>
              <col />
              {tiers.map((tier) => (
                <col key={tier.name} />
              ))}
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="sr-only">Included</span>
                </TableHead>
                {tiers.map((tier) => (
                  <TableHead key={tier.name} wrap>
                    <span className="flex h-full flex-col gap-6">
                      <Package tier={tier} plan={plan} months={months} monthlyFee={monthlyFee} money={money} reduce={reduce} />
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {rows != null && rows.length > 0 ? (
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.feature}>
                    <TableHead scope="row">{row.feature}</TableHead>
                    {tiers.map((tier, index) => (
                      <TableCell key={tier.name}>
                        <Included value={row.values[index] ?? false} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : null}
          </Table>
        </div>

        {rows != null && rows.length > 0 ? (
          <div className={tableWrapClasses} data-slot="compare">
            <Table aria-label="What each package includes">
              <TableHeader>
                <TableRow>
                  <TableHead sticky>Included</TableHead>
                  {tiers.map((tier) => (
                    <TableHead key={tier.name}>{tier.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.feature}>
                    <TableHead scope="row" sticky>
                      {row.feature}
                    </TableHead>
                    {tiers.map((tier, index) => (
                      <TableCell key={tier.name}>
                        <Included value={row.values[index] ?? false} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </Band>
    </div>
  );
}
