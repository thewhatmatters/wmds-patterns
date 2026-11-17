/**
 * Example content for Features — Bento: a made-up client portal for a small studio. The product, the projects
 * and the people are invented, and every picture is built from WMDS components (Table, Badge, Avatar, Chip,
 * Chart), so nothing here needs a licence. A client page shows its own product's screens the same way.
 */
import {
  Avatar,
  Badge,
  Card,
  ChartRankedBars,
  Chip,
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
  purpose: "What the product does, as an offset grid of cells: each one a title, a line of description and a picture of the feature at work.",
};

// A picture's panel starts at the cell's text edge and runs off the cell's right and bottom edges.
const PANEL = "absolute -right-6 top-0 left-6 md:left-8";

const projects: { name: string; stage: string; status: BadgeStatus; owner: string; next: string }[] = [
  { name: "Harbour Bakery, website", stage: "In review", status: "warning", owner: "Mara Lindqvist", next: "Thu 12 Mar" },
  { name: "Fernhill Dental, booking", stage: "Building", status: "active", owner: "Tomas Reyes", next: "Mon 16 Mar" },
  { name: "Slate Cycles, shop", stage: "Signed off", status: "success", owner: "Ines Okafor", next: "Fri 20 Mar" },
  { name: "Juniper Rooms, brand", stage: "Brief", status: "idle", owner: "Jun Hale", next: "Tue 24 Mar" },
  { name: "Kiln Pottery, menu", stage: "Building", status: "active", owner: "Mara Lindqvist", next: "Wed 1 Apr" },
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
    <div className="flex flex-col gap-3 pt-2">
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
            { label: "Admin", value: 6, valueLabel: "6%" },
          ]}
        />
      </div>
    </Card>
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

export default function Example(props: Partial<FeaturesBentoProps>) {
  return (
    <FeaturesBento
      eyebrow="Features"
      heading="One place for the whole project"
      intro="Briefs, sign-off, hours and the tools you already use, kept together so nobody has to ask where things stand."
      items={items}
      {...props}
    />
  );
}
