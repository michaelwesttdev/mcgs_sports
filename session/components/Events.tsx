import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import EventCard from "~/pages/sessions/session/components/EventCard";
import { useSessionHelper } from "~/pages/sessions/session/components/useSessionHelper";
import { useEffect, useState } from "react";
import { PSEvent, PSEventResult, PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import { Toast } from "~/components/Toast";
import PsEventResultsDialog from "~/components/ps_event_results_dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/renderer/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/renderer/components/ui/dialog";
import Print from "@/renderer/components/print";
import { useSessionState } from "./SessionStateContext";
import EventFromOtherDialog from "./event_pull_other_Dialog";
import ScrollBox from "@/renderer/components/ScrollBox";

interface Props {
    createEvent: (event: Omit<PSEvent, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    fetchSessionEvents: () => Promise<void>;
    importEventsFromMainStore: () => Promise<void>;
    events: PSEvent[];
    participants: PSParticipant[];
    houses: PSHouse[];
    onDelete: (id: string) => Promise<void>;
    onUpdate: (id: string, data: Partial<PSEvent>) => Promise<void>;
    updateResult: (id: string, result: Partial<PSEventResult>) => Promise<void>;
    createResult: (result: Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">) => Promise<void>;
    deleteResult: (id: string) => Promise<void>;
    results: PSEventResult[];
    sessionId: string
}
export default function Events() {
    const { createEvent, sessionId, importEventsFromMainStore, events, updateEvent, houses, participants, updateEventResult, createEventResult, deleteEventResult, eventResults, deleteEvent } = useSessionState()
    const [query, setQuery] = useState("");
    const [currentEvent, setCurrentEvent] = useState<PSEvent>();
    const [importDropOpen, setImportDropOpen] = useState(false)
    const [printDialogOpen, setPrintDialogOpen] = useState<{
        open: boolean;
        event: PSEvent;
    }>({
        open: false,
        event: null
    })

    function getLatestEventNumber() {
        if (!events || events.length <= 0) return 0;
        let highest = 0;
        events.forEach(e => {
            highest = e.eventNumber > highest ? e.eventNumber : highest;
        })
        return highest > 0 ? highest : 0;
    }

    function handleCurrentEventChange() {
        if (events.length === 0) {
            setCurrentEvent(null);
            return;
        }

        const nextEvent = events
            .filter(e => e.status !== "complete")
            .sort((a, b) => a.eventNumber - b.eventNumber)[0]; // get lowest eventNumber

        setCurrentEvent(nextEvent ?? null);
    }

    useEffect(() => {
        handleCurrentEventChange()
    }, [events, eventResults]);

    return (
        <ScrollBox>
            <Card className='w-full'>
                <CardHeader>
                    <div className={"flex items-center gap-4"}>
                        <SessionEventDialogForm eventNumber={getLatestEventNumber() + 1} onCreate={createEvent} />

                        <DropdownMenu open={importDropOpen} onOpenChange={(v) => {
                            setImportDropOpen(v)
                        }}>
                            <DropdownMenuTrigger asChild>
                                <Button> Import Events</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={"gap-2 flex flex-col"}>
                                <DropdownMenuItem asChild>
                                    <Button
                                        className={"w-full"}
                                        onClick={() => importEventsFromMainStore()}
                                        aria-description='Import Events from main store'>
                                        From Main
                                    </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <EventFromOtherDialog onDone={() => setImportDropOpen(false)} triggerClassName={"w-full"} />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

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
                                {currentEvent && <div className='flex items-center gap-2 mr-8'>
                                    <p className='font-semibold tracking-wider'>
                                        Current Event: {currentEvent?.eventNumber}
                                    </p>
                                    <PsEventResultsDialog onDone={(event: PSEvent) => {
                                        setPrintDialogOpen({
                                            open: true,
                                            event
                                        })
                                    }} toggleButton={<Button>Enter Results</Button>}
                                        updateEvent={updateEvent}
                                        eventId={currentEvent?.id}
                                        eventTitle={`${currentEvent?.title} - ${currentEvent?.ageGroup}`}
                                        event={currentEvent} participants={participants} houses={houses}
                                        results={eventResults.filter(r => r.eventId === currentEvent?.id) ?? []} createResult={createEventResult}
                                        updateResult={updateEventResult} deleteResult={deleteEventResult} />
                                </div>}
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
                                ) :
                                    events.filter(ev => {
                                        const q = parseInt(query)
                                        const t = `${ev.title} - ${ev.ageGroup}`
                                        return t.toLowerCase().includes(query.toLowerCase()) || ev.eventNumber === (isNaN(q) ? 0 : q)
                                    }).length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className='text-center py-8 text-muted-foreground'>
                                                No events match your search
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        events.filter(ev => {
                                            const q = parseInt(query)
                                            const t = `${ev.title} - ${ev.ageGroup}`
                                            return t.toLowerCase().includes(query.toLowerCase()) || ev.eventNumber === (isNaN(q) ? 0 : q)
                                        }).sort((a, b) => {
                                            return a.eventNumber - b.eventNumber;
                                        }).map((event) => (
                                            <EventCard
                                                sessionId={sessionId}
                                                participants={participants}
                                                houses={houses}
                                                key={event.id}
                                                event={event}
                                                onUpdate={updateEvent}
                                                onDelete={deleteEvent}
                                                updateResult={updateEventResult}
                                                deleteResult={deleteEventResult}
                                                createResult={createEventResult}
                                                results={eventResults.filter(result => result.eventId === event.id)}
                                            />
                                        ))
                                    )}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation={"horizontal"} />
                    </ScrollArea>
                </CardContent>
                <PrintDialog sessionId={sessionId} handleClose={() => setPrintDialogOpen({
                    open: false,
                    event: null
                })} data={printDialogOpen} />
            </Card>
        </ScrollBox>
    )
}

export function PrintDialog({ sessionId, handleClose, data: { open, event } }: {
    sessionId: string, handleClose: () => void, data: {
        open: boolean;
        event: PSEvent;
    }
}) {
    return (
        <Dialog open={open} onOpenChange={(v) => {
            if (!v) handleClose();
        }}>
            <DialogContent>
                <DialogTitle>{`Print Event Number ${event?.eventNumber} - ${event?.ageGroup} - ${event?.gender}`}</DialogTitle>
                <div className="flex items-center justify-center gap-5 min-w-[300px]">
                    <Button variant="destructive">Cancel</Button>
                    <Print onDone={() => handleClose()} sessionId={sessionId} id={event?.id} type="event" />
                </div>
            </DialogContent>
        </Dialog>
    )
}