/**
 * Example content for Stats — Pinned Counter: a studio's figures. Made up for the example; a client page uses
 * its own, with a source for each.
 */
import { StatsPinnedCounter, type StatsPinnedCounterProps, type StatsPinnedCounterStat } from "./StatsPinnedCounter";

export const meta = {
  type: "Stats",
  name: "Stats — Pinned Counter",
  purpose: "Key figures one at a time on a pinned screen: a huge number counts up over WMDS meter ticks that fill to it.",
  /** Moves as the page scrolls: the gallery shows it a screen tall and scrolls inside the frame. */
  scroll: true,
};

const stats: StatsPinnedCounterStat[] = [
  { value: 140, max: 200, label: "Sites launched", category: "Since 2019" },
  { value: 38, suffix: "%", label: "More enquiries in the first quarter", category: "Average" },
  { value: 4.9, max: 5, decimals: 1, suffix: "/5", label: "Client rating", category: "62 reviews" },
  { value: 6, max: 12, label: "Weeks from first call to launch", category: "Typical" },
];

export default function Example(props: Partial<StatsPinnedCounterProps>) {
  return <StatsPinnedCounter heading="By the numbers" stats={stats} {...props} />;
}
