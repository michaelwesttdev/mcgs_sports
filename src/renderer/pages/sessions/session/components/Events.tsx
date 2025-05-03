import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Badge} from "~/components/ui/badge";
import {ScrollArea, ScrollBar} from "~/components/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";
import EventCard from "~/pages/sessions/session/components/EventCard";
import {useSessionHelper} from "~/pages/sessions/session/components/useSessionHelper";
import {useState} from "react";
import {PSEvent} from "@/db/sqlite/p_sports/schema";
import {Toast} from "~/components/Toast";

interface Props {
    sessionId:string;
}
export default function Events({sessionId}:Readonly<Props>){
    const [query, setQuery] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number | null>(null);
    const { session, events, fetchSessionEvents,createEvent } =
        useSessionHelper(sessionId);

    return <Card className='w-full'>
        <CardHeader>
            <SessionEventDialogForm onCreate={createEvent}/>
            <CardTitle className='flex items-center justify-between'>
                <div className='flex flex-1 items-center gap-2'>
                    <span>Events</span>
                    <div className='flex-1 flex gap-8 items-center justify-between p-3'>
                        <div className='flex-1'>
                            <Input
                                placeholder='Search by event number or name'
                                className='max-w-60'
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                        </div>
                        <div className='flex items-center gap-2 mr-8'>
                            <p className='font-semibold tracking-wider'>
                                Current Event: 1
                            </p>
                            <Button>Enter Results</Button>
                        </div>
                    </div>
                </div>

                <Badge variant='outline'>{events.length} Events</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent className={"flex "}>
            <ScrollArea className={"w-full flex-1"}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-20'>Event #</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead className='hidden md:table-cell'>
                                Record Holder
                            </TableHead>
                            <TableHead className='hidden md:table-cell'>
                                Record
                            </TableHead>
                            <TableHead>Record Status</TableHead>
                            <TableHead className='w-24 text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className='text-center py-8 text-muted-foreground'>
                                    No events found
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.sort((a,b)=>{
                                return a.eventNumber > b.eventNumber?1:-1
                            }).map((event) => (
                                <EventCard
                                    sessionId={sessionId}
                                    key={event.id}
                                    event={event}
                                    onUpdate={async (eventId:string,eventData: Partial<PSEvent>) => {
                                        try {
                                            const res = await window.api.psUpdateEvent([sessionId,[event.id,eventData]]);
                                            if (!res.success) throw res.error;
                                            await fetchSessionEvents();
                                        } catch (error) {
                                            console.error("Failed to update event:", error);
                                            throw error;
                                        }
                                    }}
                                    onDelete={async(id) => {
                                        try {
                                            const res = await window.api.psDeleteEvent([sessionId,id]);
                                            if (!res.success) throw res.error;
                                            await fetchSessionEvents();
                                            Toast({message:"Event Deleted Successfully",variation:"success"});
                                        }
                                        catch (error) {
                                            console.error("Failed to delete event:", error);
                                            Toast({message:"Failed to delete event",variation:"error"});
                                        }
                                    }}
                                    onupdateresults={() => {}}
                                    editingId={editingId}
                                    setEditingId={setEditingId}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation={"horizontal"}/>
            </ScrollArea>
        </CardContent>
    </Card>
}