/**
 * Example content for Team — Ruled Grid: a small studio of four. The people are made up, and each portrait is a
 * flat cut-paper bust drawn in SVG from WMDS chart colours (licence-free stand-ins); a client page uses real photos
 * of its people, with their permission.
 */
import { TextLink } from "@thewhatmatters/wmds";
import { TeamRuledGrid, type TeamRuledGridPerson, type TeamRuledGridProps } from "./TeamRuledGrid";

export const meta = {
  type: "Team",
  name: "Team — Ruled Grid",
  purpose: "The people behind the work in ruled cells: portrait, name and role under a heading and a short intro.",
};

const c = (n: number) => `var(--color-chart-categorical-${n})`;

/** A flat bust: a field, shoulders, a head and one hair shape. */
function Bust({ field, body, hair, shape }: { field: string; body: string; hair: string; shape: "bob" | "short" | "bun" | "long" }) {
  const hairShape = {
    bob: <path d="M118 150c0-48 34-78 82-78s82 30 82 78v44h-26v-40c0-30-24-48-56-48s-56 18-56 48v40h-26z" fill={hair} />,
    short: <path d="M128 140c0-40 30-64 72-64s72 24 72 64c-14-18-40-28-72-28s-58 10-72 28z" fill={hair} />,
    bun: <><circle cx="200" cy="64" r="26" fill={hair} /><path d="M130 146c0-42 30-66 70-66s70 24 70 66c-16-20-40-30-70-30s-54 10-70 30z" fill={hair} /></>,
    long: <path d="M116 156c0-52 36-84 84-84s84 32 84 84v120h-30v-116c0-30-24-50-54-50s-54 20-54 50v116h-30z" fill={hair} />,
  }[shape];
  return (
    <svg viewBox="0 0 400 500" width={400} height={500} aria-hidden className="block size-full">
      <rect width="400" height="500" fill={field} />
      <rect x="174" y="200" width="52" height="190" rx="22" fill="var(--color-background-body)" />
      <path d="M70 500c0-90 58-150 130-150s130 60 130 150z" fill={body} />
      <circle cx="200" cy="170" r="70" fill="var(--color-background-body)" />
      {hairShape}
    </svg>
  );
}

const people: TeamRuledGridPerson[] = [
  {
    name: "Ana Torres",
    role: "Founder · Design",
    portrait: <Bust field={c(4)} body={c(1)} hair={c(2)} shape="bob" />,
    link: <TextLink href="#ana">Ana's work</TextLink>,
  },
  {
    name: "Marcus Hale",
    role: "Engineering",
    portrait: <Bust field={c(2)} body={c(5)} hair={c(1)} shape="short" />,
  },
  {
    name: "Priya Nair",
    role: "Video and social",
    portrait: <Bust field={c(3)} body={c(2)} hair={c(5)} shape="bun" />,
  },
  {
    name: "Sam Ortiz",
    role: "Client care",
    portrait: <Bust field={c(5)} body={c(4)} hair={c(3)} shape="long" />,
  },
];

export default function Example(props: Partial<TeamRuledGridProps>) {
  return (
    <TeamRuledGrid
      eyebrow="Team"
      heading="Four people, one studio."
      intro="Designers, an engineer and a filmmaker who have built sites for small businesses since 2019. The people on your first call are the people who build it."
      people={people}
      {...props}
    />
  );
}
