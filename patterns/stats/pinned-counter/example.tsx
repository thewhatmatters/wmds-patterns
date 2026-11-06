/**
 * Example content for Stats — Pinned Counter: one measure (more enquiries than before launch) building over a
 * year. Made up for the example; a client page uses its own, with a source for each.
 */
import { StatsPinnedCounter, type StatsPinnedCounterProps, type StatsPinnedCounterStat } from "./StatsPinnedCounter";

export const meta = {
  type: "Stats",
  name: "Stats — Pinned Counter",
  purpose: "One measure building on a pinned screen: a large dial of ticks sweeps up from each figure to the next, all in one unit.",
  /** Moves as the page scrolls: the gallery shows it a screen tall and scrolls inside the frame. */
  scroll: true,
};

const stats: StatsPinnedCounterStat[] = [
  { value: 12, label: "More enquiries after one month", category: "Month 1" },
  { value: 31, label: "More enquiries after three months", category: "Month 3" },
  { value: 54, label: "More enquiries after six months", category: "Month 6" },
  { value: 82, label: "More enquiries after a year", category: "Month 12" },
];

export default function Example(props: Partial<StatsPinnedCounterProps>) {
  return <StatsPinnedCounter heading="What a new site does" stats={stats} unit={{ suffix: "%", max: 100 }} {...props} />;
}
