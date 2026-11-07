/**
 * Example content for Logos — Marquee: twelve made-up Austin businesses as simple wordmarks drawn in SVG with
 * `currentColor` (licence-free stand-ins, the same kind Hero — Stage uses). A client page uses its clients' real
 * marks, with permission.
 */
import { LogosMarquee, type LogosMarqueeLogo, type LogosMarqueeProps } from "./LogosMarquee";

export const meta = {
  type: "Logos",
  name: "Logos — Marquee",
  purpose: "A quiet proof strip: a short label beside or above client marks drifting slowly past, fading at both edges.",
  variants: [
    { id: "inline", label: "Label inline" },
    { id: "above", label: "Label above" },
  ],
};

type MarkSpec = { name: string; text: string; width: number; weight: number; caps?: boolean; italic?: boolean; symbol?: "circle" | "bar" | "book" };
const marks: MarkSpec[] = [
  { name: "Barton Bakehouse", text: "BARTON", width: 80, weight: 800, caps: true },
  { name: "Eastside Tire", text: "eastside", width: 90, weight: 500, symbol: "circle" },
  { name: "Lone Star Yoga", text: "Lone Star", width: 74, weight: 400, italic: true },
  { name: "Pecan St. Dental", text: "PECAN", width: 84, weight: 600, caps: true, symbol: "bar" },
  { name: "Mueller Books", text: "Mueller", width: 90, weight: 700, symbol: "book" },
  { name: "Rainey Records", text: "rainey", width: 56, weight: 800 },
  { name: "Zilker Bikes", text: "ZILKER", width: 90, weight: 500, caps: true, symbol: "circle" },
  { name: "Bouldin Florals", text: "Bouldin", width: 62, weight: 600, italic: true },
  { name: "Holly St. Coffee", text: "HOLLY ST", width: 92, weight: 700, caps: true },
  { name: "Tarrytown Vet", text: "Tarrytown", width: 100, weight: 500, symbol: "bar" },
  { name: "Govalle Gym", text: "GOVALLE", width: 90, weight: 800, caps: true },
  { name: "Clarksville Cuts", text: "clarksville", width: 96, weight: 600 },
];
const symbols = {
  circle: <circle cx="8" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />,
  book: <path d="M1 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H1zM15 4H9a2 2 0 0 0-2 2" fill="none" stroke="currentColor" strokeWidth="2" />,
  bar: <rect x="1" y="4" width="5" height="16" fill="currentColor" />,
};
function Wordmark({ spec }: { spec: MarkSpec }) {
  const offset = spec.symbol ? 20 : 0;
  return (
    <svg viewBox={`0 0 ${spec.width + offset} 24`}>
      {spec.symbol ? symbols[spec.symbol] : null}
      <text
        x={offset}
        y="17.5"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="16"
        fontWeight={spec.weight}
        fontStyle={spec.italic ? "italic" : undefined}
        letterSpacing={spec.caps ? "1" : "-0.4"}
      >
        {spec.text}
      </text>
    </svg>
  );
}
const logos: LogosMarqueeLogo[] = marks.map((spec) => ({ name: spec.name, logo: <Wordmark spec={spec} /> }));

/** The gallery passes `variant`: the label beside the marks (`inline`) or above them (`above`). */
export default function Example({ variant = "inline", ...props }: Partial<LogosMarqueeProps> & { variant?: string }) {
  return (
    <LogosMarquee
      label="Trusted by 140 local businesses"
      logos={logos}
      labelPlacement={variant === "above" ? "above" : "inline"}
      {...props}
    />
  );
}
