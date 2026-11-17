/**
 * Example content for Features — Bento: a made-up client portal for a small studio, shown in two directions
 * (the gallery's Variant control). The layout and the words are the same in both; only what sits in the cells'
 * `visual` slots changes, which is how a site makes the pattern its own.
 *
 * - `interactive`: the visuals sit above the words and three of them work. The reader can filter the board,
 *   tick off a sign-off and switch the hours between periods. The fourth wakes while the pointer is over it.
 * - `screens`: the visuals are still pictures of the product under the words, running off the cells' edges.
 *
 * The product, the projects and the people are invented, and every visual is built from WMDS components, so
 * nothing here needs a licence.
 */
import { useState } from "react";
import {
  Avatar,
  Badge,
  Card,
  ChartRankedBars,
  Checkbox,
  Chip,
  SegmentedControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type BadgeStatus,
} from "@thewhatmatters/wmds";
import { FeaturesBento, FeaturesBentoDrift, type FeaturesBentoItem, type FeaturesBentoProps } from "./FeaturesBento";

export const meta = {
  type: "Features",
  name: "Features — Bento",
  purpose:
    "A bento layout for a features section: an offset grid of cells, each a title, a line of description and a slot for whatever shows the feature. The visuals follow the site's direction: still screens, moving pictures or small working demos.",
  variants: [
    { id: "interactive", label: "Interactive" },
    { id: "screens", label: "Product screens" },
  ],
};

// A picture's panel starts at the cell's text edge and runs off the cell's right and bottom edges.
const PANEL = "absolute -right-6 top-0 left-6 md:left-8";

const projects: { name: string; stage: string; status: BadgeStatus; owner: string; next: string }[] = [
  { name: "Harbour Bakery, website", stage: "In review", status: "warning", owner: "Mara Lindqvist", next: "Thu 12 Mar" },
  { name: "Fernhill Dental, booking", stage: "Building", status: "active", owner: "Tomas Reyes", next: "Mon 16 Mar" },
  { name: "Slate Cycles, shop", stage: "Signed off", status: "success", owner: "Ines Okafor", next: "Fri 20 Mar" },
  { name: "Juniper Rooms, brand", stage: "Brief", status: "idle", owner: "Jun Hale", next: "Tue 24 Mar" },
  { name: "Kiln Pottery, menu", stage: "Building", status: "active", owner: "Mara Lindqvist", next: "Wed 1 Apr" },
  { name: "Orchard School, prospectus", stage: "In review", status: "warning", owner: "Ines Okafor", next: "Fri 3 Apr" },
  { name: "Tidewater Tours, booking", stage: "Brief", status: "idle", owner: "Tomas Reyes", next: "Tue 7 Apr" },
];

function Board() {
  return (
    <Card variant="outlined" className={PANEL}>
      <Table aria-label="Projects">
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Next date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.name}>
              <TableCell className="whitespace-nowrap text-fg">{project.name}</TableCell>
              <TableCell>
                <Badge status={project.status}>{project.stage}</Badge>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Avatar name={project.owner} size="xsm" />
                  {project.owner}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">{project.next}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

const reviews: { who: string; note: string; verdict: string; status: BadgeStatus }[] = [
  { who: "Ines Okafor", note: "Home page, round 2", verdict: "Approved", status: "success" },
  { who: "Tomas Reyes", note: "Menu photography", verdict: "Approved", status: "success" },
  { who: "Jun Hale", note: "Booking flow", verdict: "Waiting", status: "idle" },
  { who: "Mara Lindqvist", note: "Opening hours copy", verdict: "Changes", status: "warning" },
  { who: "Ines Okafor", note: "Launch checklist", verdict: "Waiting", status: "idle" },
];

function SignOff() {
  return (
    <ul className="flex flex-col gap-3 px-6 md:px-8">
      {reviews.map((review) => (
        <li key={review.note}>
          <Card variant="outlined" className="flex-row items-center gap-3 p-3">
            <Avatar name={review.who} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate type-body text-fg">{review.note}</span>
              <span className="block truncate type-supporting text-muted">{review.who}</span>
            </span>
            <Badge status={review.status}>{review.verdict}</Badge>
          </Card>
        </li>
      ))}
    </ul>
  );
}

const tools = [
  ["Calendar", "Invoices", "Shared files", "Team chat", "Time sheets", "Contracts"],
  ["Design files", "Email", "Bookkeeping", "Forms", "Video calls", "Storage"],
  ["Payments", "Analytics", "Domains", "Hosting", "Support desk", "Notes"],
];

function Tools() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {tools.map((row, index) => (
        <FeaturesBentoDrift key={row[0]} direction={index % 2 === 0 ? "left" : "right"} duration={36 + index * 6}>
          {row.map((tool) => (
            <Chip key={tool} size="lg" readOnly>
              {tool}
            </Chip>
          ))}
        </FeaturesBentoDrift>
      ))}
    </div>
  );
}

function Hours() {
  return (
    <Card variant="outlined" className={PANEL}>
      <div className="p-6 pr-12">
        <p className="mb-4 type-eyebrow text-muted">March, 412 hours</p>
        <ChartRankedBars
          aria-label="Hours by kind of work in March"
          animate="none"
          items={[
            { label: "Design", value: 38, valueLabel: "38%" },
            { label: "Build", value: 31, valueLabel: "31%" },
            { label: "Content", value: 14, valueLabel: "14%" },
            { label: "Meetings", value: 11, valueLabel: "11%" },
            { label: "Admin", value: 4, valueLabel: "4%" },
            { label: "Travel", value: 2, valueLabel: "2%" },
          ]}
        />
      </div>
    </Card>
  );
}

const boardStages = ["All", "Building", "In review"];

/** The board as a working demo: the control filters the rows. */
function BoardLive() {
  const [stage, setStage] = useState("All");
  const shown = projects.slice(0, 5).filter((project) => stage === "All" || project.stage === stage);
  return (
    // The height holds five rows, so the section doesn't move as the filter narrows them.
    <div className="flex h-full min-h-108 flex-col items-start gap-4 px-6 pt-6 md:px-8 md:pt-8">
      <SegmentedControl aria-label="Show projects by stage" value={stage} onValueChange={setStage}>
        {boardStages.map((name) => (
          <SegmentedControl.Item key={name} value={name}>
            {name}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl>
      <Card variant="outlined" className="min-h-0 w-full flex-1 overflow-hidden rounded-b-none border-b-0">
        <Table aria-label="Projects">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="hidden lg:table-cell">Next date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((project) => (
              <TableRow key={project.name}>
                <TableCell className="text-fg">{project.name}</TableCell>
                <TableCell>
                  <Badge status={project.status}>{project.stage}</Badge>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap lg:table-cell">{project.next}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

const drafts = reviews.slice(0, 4);

/** Sign-off as a working demo: ticking a draft signs it off, and the count follows. */
function SignOffLive() {
  const [signed, setSigned] = useState<string[]>([drafts[0].note, drafts[1].note]);
  const toggle = (note: string) =>
    setSigned((now) => (now.includes(note) ? now.filter((each) => each !== note) : [...now, note]));
  return (
    <div className="flex flex-col gap-3 p-6 md:p-8">
      <p className="flex items-baseline justify-between gap-3 type-eyebrow text-muted">
        <span>This week</span>
        <span aria-live="polite">
          {signed.length} of {drafts.length} signed off
        </span>
      </p>
      <ul className="flex flex-col gap-2">
        {drafts.map((draft) => (
          <li key={draft.note}>
            <Card variant="outlined" padding="none" className="!py-0">
              <Checkbox
                className="p-3"
                label={draft.note}
                description={draft.who}
                checked={signed.includes(draft.note)}
                onChange={() => toggle(draft.note)}
              />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

const periods: Record<string, { total: string; shares: number[] }> = {
  Week: { total: "This week, 96 hours", shares: [44, 27, 9, 14, 5, 1] },
  Month: { total: "March, 412 hours", shares: [38, 31, 14, 11, 4, 2] },
  Quarter: { total: "January to March, 1,180 hours", shares: [33, 35, 16, 9, 5, 2] },
};
const kinds = ["Design", "Build", "Content", "Meetings", "Admin", "Travel"];

/** The hours as a working demo: the control switches the period, and the bars follow. */
function HoursLive() {
  const [period, setPeriod] = useState("Month");
  const { total, shares } = periods[period];
  return (
    <div className="flex flex-col items-start gap-4 p-6 md:p-8">
      <SegmentedControl aria-label="Show hours for a period" value={period} onValueChange={setPeriod}>
        {Object.keys(periods).map((name) => (
          <SegmentedControl.Item key={name} value={name}>
            {name}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl>
      <p className="type-eyebrow text-muted" aria-live="polite">
        {total}
      </p>
      <ChartRankedBars
        className="w-full"
        aria-label="Hours by kind of work"
        animate="none"
        max={50}
        items={kinds.map((label, index) => ({ label, value: shares[index], valueLabel: `${shares[index]}%` }))}
      />
    </div>
  );
}

const items: FeaturesBentoItem[] = [
  {
    title: "Every project on one board",
    description: "Stage, owner and next date for each job, updated as the work moves.",
    visual: <Board />,
  },
  {
    title: "Sign-off without the email chain",
    description: "Reviewers approve in one click, and you see who is still to answer.",
    visual: <SignOff />,
  },
  {
    title: "Works with what you use",
    description: "Calendar, files, invoices and chat feed in. Nothing to enter twice.",
    visual: <Tools />,
  },
  {
    title: "See where the hours went",
    description: "Time by kind of work, so the next quote starts from real numbers.",
    visual: <Hours />,
  },
];

/** The same four cells with working visuals in three of them. */
const liveVisuals = [<BoardLive key="board" />, <SignOffLive key="sign-off" />, undefined, <HoursLive key="hours" />];
const liveItems: FeaturesBentoItem[] = items.map((item, index) => {
  const visual = liveVisuals[index];
  return visual ? { ...item, visual, interactive: true } : item;
});

/** What changes between the two directions: the cells' visuals and where they sit. */
export const variants: Record<string, Pick<FeaturesBentoProps, "items" | "media">> = {
  interactive: { items: liveItems, media: "above" },
  screens: { items, media: "below" },
};

/** The pattern filled with the example content, in one of the variants (the gallery passes `variant`). */
export default function Example({ variant = "interactive", ...props }: Partial<FeaturesBentoProps> & { variant?: string }) {
  const chosen = variants[variant] ?? variants.interactive;
  return (
    <FeaturesBento
      eyebrow="Features"
      heading="One place for the whole project"
      intro="Briefs, sign-off, hours and the tools you already use, kept together so nobody has to ask where things stand."
      {...chosen}
      {...props}
    />
  );
}
