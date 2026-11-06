/**
 * Example content for Pricing — Ruled Table: a studio's three website packages and what each includes. Prices
 * and features are made up for the example; a client page uses its own.
 */
import { Button } from "@thewhatmatters/wmds";
import { PricingRuledTable, type PricingRuledTableProps, type PricingRuledTableRow, type PricingRuledTableTier } from "./PricingRuledTable";

export const meta = {
  type: "Pricing",
  name: "Pricing — Ruled Table",
  purpose: "Fixed-price packages in ruled cells, a pay-once / spread-monthly toggle, and a comparison table.",
  /** The package headers pin while the rows scroll: the gallery shows it a screen tall and scrolls inside the frame. */
  scroll: true,
};

const tiers: PricingRuledTableTier[] = [
  {
    name: "Starter site",
    description: "Five pages, your words and photos, live in four weeks.",
    price: 6800,
    action: (
      <Button role="outline" size="lg" render={<a href="#start-starter" />}>
        Start a Starter site
      </Button>
    ),
  },
  {
    name: "Business site",
    description: "Up to twelve pages, bookings or a menu, and a month of care after launch.",
    price: 12400,
    badge: "Most picked",
    action: (
      <Button role="primary" size="lg" render={<a href="#start-business" />}>
        Start a Business site
      </Button>
    ),
  },
  {
    name: "Larger build",
    description: "A shop, a member area or anything the others don't cover.",
    price: null,
    action: (
      <Button role="outline" size="lg" render={<a href="#talk" />}>
        Talk to us
      </Button>
    ),
  },
];

const rows: PricingRuledTableRow[] = [
  { feature: "Pages", values: ["Up to 5", "Up to 12", "As needed"] },
  { feature: "Copy written for you", values: [false, true, true] },
  { feature: "Bookings or menu", values: [false, true, true] },
  { feature: "Online shop", values: [false, false, true] },
  { feature: "Edit it yourself", values: [true, true, true] },
  { feature: "Care after launch", values: ["2 weeks", "1 month", "3 months"] },
];

export default function Example(props: Partial<PricingRuledTableProps>) {
  return (
    <PricingRuledTable
      eyebrow="Pricing"
      heading="Fixed prices, no surprises."
      intro="Pick a package, pay once or spread it over a year. Every price includes design, build and launch."
      tiers={tiers}
      rows={rows}
      {...props}
    />
  );
}
