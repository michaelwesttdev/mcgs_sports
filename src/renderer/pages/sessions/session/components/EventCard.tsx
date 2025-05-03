import {PSEvent} from "@/db/sqlite/p_sports/schema";
import {TableCell, TableRow} from "~/components/ui/table";
import {Input} from "~/components/ui/input";
import {getGenderName} from "@/shared/genderName";
import {Button} from "~/components/ui/button";
import {Edit2, Save, Trash} from "lucide-react";
import {useState} from "react";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import {DeleteModal} from "~/components/deleteModal";

type EventProps = {
    event: PSEvent;
    onUpdate: (eventId:string,event: Partial<PSEvent>) => Promise<void>;
    onDelete: (eventId:string) => Promise<void>;
    onupdateresults: (event: PSEvent) => void;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    sessionId:string
};
export default function EventCard({ event, onUpdate, onDelete,sessionId }: EventProps) {

    return (
        <TableRow key={event.id}>
            <TableCell> {event.eventNumber || "-"}</TableCell>
            <TableCell className='font-medium'>{`${event.title} - ${event.ageGroup<100?`U${event.ageGroup}`:"Open"}`}</TableCell>
            <TableCell className='font-medium'>{getGenderName(event.gender)}</TableCell>
            <TableCell className='hidden md:table-cell'>{event.recordHolder || "-"}</TableCell>
            <TableCell className='hidden md:table-cell'> {event.record ? (`${event.record} ${event.measurementMetric || ""}`) : ("-")}</TableCell>
            <TableCell>
                {
                    event.isRecordBroken?"New Record!":"Unchanged"
                }
            </TableCell>
            <TableCell className='flex items-center gap-2 justify-end'>
                <SessionEventDialogForm purpose={"edit"} event={event} onUpdate={onUpdate}/>
                <DeleteModal onDelete={async()=>await onDelete(event.id)} itemName={`event number ${event.eventNumber} (${event.title} - U${event.ageGroup} (${getGenderName((event.gender))}))`} trigger={<Button variant="destructive" size={"icon"} className={`w-6 h-6`}>
                    <Trash className={"w-4 h-4"}/>
                </Button>}/>
            </TableCell>
        </TableRow>
    );
}