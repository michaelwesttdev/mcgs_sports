import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import {TableCell, TableRow} from "~/components/ui/table";
import {Input} from "~/components/ui/input";
import {getGenderName} from "@/shared/genderName";
import {Button} from "~/components/ui/button";
import {Edit2, Save, Trash} from "lucide-react";
import {useState} from "react";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import {DeleteModal} from "~/components/deleteModal";
import PsEventResultsDialog from "~/components/ps_event_results_dialog";
import {Badge} from "~/components/ui/badge";
import { cn } from "@/renderer/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/renderer/components/ui/dialog";
import Print from "@/renderer/components/print";

type EventProps = {
    event: PSEvent;
    participants: PSParticipant[];
    houses: PSHouse[];
    onUpdate: (eventId:string,event: Partial<PSEvent>) => Promise<void>;
    onDelete: (eventId:string) => Promise<void>;
    updateResult: (id:string,result:Partial<PSEventResult>) => Promise<void>;
    createResult: (result:Omit<PSEventResult,"createdAt"|"updatedAt"|"deletedAt">) => Promise<void>;
    deleteResult: (id:string) => Promise<void>;
    results: PSEventResult[];
};
export default function EventCard({updateResult,createResult,deleteResult,results, event, onUpdate,participants,houses, onDelete }: EventProps) {
    const [printDialogOpen,setPrintDialogOpen] = useState(false)
    const isCompleted = results.some(r => r.eventId === event.id);

    return (
        <TableRow key={event.id} className={cn(event.status==="complete"&&"bg-muted text-green-800")}>
            <TableCell> {event.eventNumber || "-"}</TableCell>
            <TableCell className='font-medium'>{`${event.title} - ${event.ageGroup}`}</TableCell>
            <TableCell className='font-medium'>{getGenderName(event.gender)}</TableCell>
            <TableCell className='hidden md:table-cell'>{event.recordHolder || "-"}</TableCell>
            <TableCell className='hidden md:table-cell'> {event.record ? (`${event.record} ${event.measurementMetric || ""}`) : ("-")}</TableCell>
            <TableCell>
                <Badge variant={event.isRecordBroken?"default":"outline"}>
                    {
                        event.isRecordBroken?"New Record!":"Unchanged"
                    }
                </Badge>
            </TableCell>
            <TableCell className='flex items-center gap-2 justify-end'>
                <SessionEventDialogForm purpose={"edit"} event={event} onUpdate={onUpdate}/>
                <PsEventResultsDialog onDone={()=>setPrintDialogOpen(true)} updateEvent={onUpdate} createResult={createResult} updateResult={updateResult} results={results} deleteResult={deleteResult} participants={participants} houses={houses} eventId={event.id} eventTitle={`${event.title} - ${event.ageGroup} ${getGenderName(event.gender)}`} event={event}/>
                <DeleteModal onDelete={async()=>await onDelete(event.id)} itemName={`event number ${event.eventNumber} (${event.title} - U${event.ageGroup} (${getGenderName((event.gender))}))`} trigger={<Button variant="destructive" size={"icon"} className={`w-6 h-6`}>
                    <Trash className={"w-4 h-4"}/>
                </Button>}/>
                <PrintDialog isOpen={printDialogOpen} id={event.id} title={`Print Event Number ${event.eventNumber} - ${event.ageGroup} - ${event.gender}`} setIsOpen={(v)=>setPrintDialogOpen(v)}/>
            </TableCell>
        </TableRow>
    );
}

function PrintDialog({isOpen=false,id,title="Print Event",setIsOpen}:{isOpen:boolean,id:string,title?:string,setIsOpen:(v:boolean)=>void}){
    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <div className="flex items-center justify-center gap-5 min-w-[300px]">
                    <Button variant="destructive">Cancel</Button>
                    <Print id={id} type="event"/>
                </div>
            </DialogContent>
        </Dialog>
    )
}