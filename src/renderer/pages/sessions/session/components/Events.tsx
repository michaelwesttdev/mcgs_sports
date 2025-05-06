import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Badge} from "~/components/ui/badge";
import {ScrollArea, ScrollBar} from "~/components/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";
import EventCard from "~/pages/sessions/session/components/EventCard";
import {useSessionHelper} from "~/pages/sessions/session/components/useSessionHelper";
import {useEffect, useState} from "react";
import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import {Toast} from "~/components/Toast";
import PsEventResultsDialog from "~/components/ps_event_results_dialog";
import EventCsvDialog from "@/renderer/components/event_CSV_Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/renderer/components/ui/dropdown-menu";

interface Props {
    createEvent:(event:Omit<PSEvent,"id"|"createdAt"|"updatedAt">)=>Promise<void>;
    fetchSessionEvents:()=>Promise<void>;
    importEventsFromMainStore:()=>Promise<void>;
    events:PSEvent[];
    participants:PSParticipant[];
    houses:PSHouse[];
    onDelete:(id:string)=>Promise<void>;
    onUpdate:(id:string,data:Partial<PSEvent>)=>Promise<void>;
    updateResult: (id:string,result:Partial<PSEventResult>) => Promise<void>;
    createResult: (result:Omit<PSEventResult,"createdAt"|"updatedAt"|"deletedAt">) => Promise<void>;
    deleteResult: (id:string) => Promise<void>;
    results: PSEventResult[];
}
export default function Events({createEvent,importEventsFromMainStore,events,onUpdate,houses,participants,updateResult,createResult,deleteResult,results,onDelete}:Readonly<Props>){
    const [query, setQuery] = useState("");
    const [currentEvent, setCurrentEvent] = useState<PSEvent>();

    function getLatestEventNumber(){
        if (!events) return 1;
        let highest = 0;
        events.forEach(e=>{
            highest = e.eventNumber > highest? e.eventNumber : highest;
        })
        return highest > 0 ? highest : 1;
    }

    useEffect(() => {
        if (events.length === 0) {
            setCurrentEvent(null);
            return;
        }

        const nextEvent = events
            .filter(e => e.status !== "complete") // or whatever status means it's done
            .sort((a, b) => a.eventNumber - b.eventNumber)[0]; // get lowest eventNumber

        setCurrentEvent(nextEvent ?? null);
    }, [events,results]);

    return <Card className='w-full'>
        <CardHeader>
            <div className={"flex items-center gap-4"}>
                <SessionEventDialogForm eventNumber={getLatestEventNumber() +1} onCreate={createEvent}/>
               
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button> Import Events</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                             <Button
                    onClick={() => importEventsFromMainStore()}
                    aria-description='Import Events from main store'>
                    From Main
                </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                             <EventCsvDialog/>
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
                        {currentEvent&&<div className='flex items-center gap-2 mr-8'>
                            <p className='font-semibold tracking-wider'>
                                Current Event: {currentEvent?.eventNumber}
                            </p>
                            <PsEventResultsDialog toggleButton={<Button>Enter Results</Button>}
                                                  updateEvent={onUpdate}
                                                  eventId={currentEvent?.id}
                                                  eventTitle={`${currentEvent?.title} - ${currentEvent?.ageGroup < 100 ? `U${currentEvent?.ageGroup}` : "Open"}`}
                                                  event={currentEvent} participants={participants} houses={houses}
                                                  results={results.filter(r=>r.eventId===currentEvent?.id)??[]} createResult={createResult}
                                                  updateResult={updateResult} deleteResult={deleteResult}/>
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
                        ) : (
                            events.sort((a,b)=>{
                                return a.eventNumber > b.eventNumber?1:-1
                            }).map((event) => (
                                <EventCard
                                    participants={participants}
                                    houses={houses}
                                    key={event.id}
                                    event={event}
                                    onUpdate={onUpdate}
                                    onDelete={onDelete}
                                    updateResult={updateResult}
                                    deleteResult={deleteResult}
                                    createResult={createResult}
                                    results={results.filter(result=>result.eventId===event.id)}
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