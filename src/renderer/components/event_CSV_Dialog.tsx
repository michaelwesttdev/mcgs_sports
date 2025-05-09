import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

export type SessionCsvEvent = {
    eventNumber: number,
    title: string,
    type: "team" | "individual",
    ageGroup: Date,
    gender: "male" | "female" | "mixed"
    recordHolder: string
    measurementMetric: string,
    record: string,
}
export const SessionCsvEventHeaders = [
    "eventNumber",
    "title",
    "type",
    "ageGroup",
    "gender",
    "recordHolder",
    "measurementMetric",
    "record",
]

export default function EventCsvDialog() {
    return (
        <Dialog>
            <DialogTrigger><Button>From CSV</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Import Events From CSV
                    </DialogTitle>
                </DialogHeader>
                <ul> <li>Use these column headers in order: <code>eventNumber, title, type, ageGroup, gender, recordHolder, measurementMetric, record</code></li> <li><code>type</code>: must be <code>team</code> or <code>individual</code></li> <li><code>ageGroup</code>: format as <code>YYYY-MM-DD</code> (e.g. <code>2010-01-01</code>)</li> <li><code>gender</code>: must be <code>male</code>, <code>female</code>, or <code>mixed</code></li> <li><code>eventNumber</code>: unique number for each event</li> <li><code>record</code>: numeric string (e.g. <code>12.5</code>)</li> <li>No blank rows or extra columns</li> <li>Save as <code>.csv</code>, UTF-8 encoded</li> <li>Upload using the import tool</li> </ul>
                <DialogFooter>
                    <Button>Download Template</Button>
                    <Input type="file" accept="file/csv" placeholder="Select CSV"></Input>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}