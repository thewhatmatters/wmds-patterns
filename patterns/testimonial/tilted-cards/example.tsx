/**
 * Example content for Testimonial — Tilted Cards. The clients and quotes are made up for the example, and no
 * photos are used (WMDS `Avatar` shows initials), so it's licence-free; a client page uses real quotes with
 * permission.
 */
import { Button } from "@thewhatmatters/wmds";
import { TestimonialTiltedCards, type TestimonialTiltedCardsQuote, type TestimonialTiltedCardsProps } from "./TestimonialTiltedCards";

export const meta = {
  type: "Testimonial",
  name: "Testimonial — Tilted Cards",
  purpose: "Client quotes as cards at small alternating angles in a row the visitor drags, on a dark field.",
};

const quotes: TestimonialTiltedCardsQuote[] = [
  {
    result: "Bookings up 40%",
    quote: "We used to take orders by text at midnight. Now people book a cake on the site and it shows up on our calendar.",
    name: "Maria Delgado",
    role: "Owner, Eastside Bakery",
  },
  {
    quote: "They shot a week of video in one afternoon without getting in the way of a single patient. Our feed finally looks like us.",
    name: "Dr. Sam Okafor",
    role: "Founder, Northloop Physio",
  },
  {
    result: "Calls doubled in a quarter",
    quote: "I asked for a website. I got a plan for the next year, and a site I can change myself on a Sunday.",
    name: "Jen Whitaker",
    role: "Whitaker Roofing",
  },
  {
    quote: "The care plan is the best money we spend. Things just stay fast, and when I need a change it's done the same week.",
    name: "Luis Ortega",
    role: "Manager, Casa Ortega",
  },
  {
    result: "Bounce rate down by a third",
    quote: "Clear about price, clear about dates, and they told us what not to build. Rare, and worth a lot.",
    name: "Priya Raman",
    role: "Director, Lantern Yoga",
  },
];

export default function Example(props: Partial<TestimonialTiltedCardsProps>) {
  return (
    <TestimonialTiltedCards
      eyebrow="Clients"
      heading="What it's like to work with us."
      actions={
        <Button role="outline" size="lg" render={<a href="#work" />}>
          See the work
        </Button>
      }
      quotes={quotes}
      {...props}
    />
  );
}
