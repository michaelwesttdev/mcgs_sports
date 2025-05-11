import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";

export type SessionCsvEvent = {
  eventNumber: number;
  title: string;
  type: "team" | "individual";
  ageGroup: Date;
  gender: "male" | "female" | "mixed";
  recordHolder: string;
  measurementMetric: string;
  record: string;
};
export const SessionCsvEventHeaders = [
  "eventNumber",
  "title",
  "type",
  "ageGroup",
  "gender",
  "recordHolder",
  "measurementMetric",
  "record",
];

type Props = {
  triggerClassName?: string;
};
export default function EventCsvDialog({ triggerClassName }: Readonly<Props>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(triggerClassName)}>From CSV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Events From CSV</DialogTitle>
        </DialogHeader>
        <ol className={"list-item"}>
          <li>
            Use these column headers in order:<br/>
            <code>
              eventNumber, title, type, ageGroup, gender, recordHolder,record
              metric, nature
            </code>
          </li>
          <li>
            <code>type</code>: must be team or individual
          </li>
          <li>
            <code>ageGroup</code>: format as <code>YYYY-MM-DD</code>
          </li>
          <li>
            <code>gender</code>: must be <code>male</code>, <code>female</code>,
            or <code>mixed</code>
          </li>{" "}
          <li>
            <code>eventNumber</code>: unique number for each event
          </li>{" "}
          <li>
            <code>record</code>: numeric string (e.g. <code>12.5</code>)
          </li>{" "}
          <li>No blank rows or extra columns</li>{" "}
          <li>
            Save as <code>.csv</code>, UTF-8 encoded
          </li>{" "}
          <li>Upload using the import tool</li>{" "}
        </ol>
        <DialogFooter>
          <Button>Download Template</Button>
          <Input type="file" accept="file/csv" placeholder="Select CSV"></Input>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  );
}
