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
import {PSEvent, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import ParticipantDialogForm from "~/components/participant-dialog-form";
import {Toast} from "~/components/Toast";
import ParticipantCard from "~/pages/sessions/session/components/ParticipantCard";

interface Props {
    houses:PSHouse[];
    participants:PSParticipant[];
    createNewParticipant:(participant:Omit<PSParticipant,"id"|"createdAt"|"updatedAt">)=>Promise<void>;
    updateParticipant:(id:string,data:Partial<PSParticipant>)=>Promise<void>;
    deleteParticipant:(id:string)=>Promise<void>;
    fetchHouses:()=>Promise<void>;
    fetchParticipants:()=>Promise<void>;
    createHouse:(house:Omit<PSHouse,"id"|"createdAt"|"updatedAt">)=>Promise<void>;
}
export default function Participants({houses,participants,createHouse,deleteParticipant,createNewParticipant,updateParticipant,fetchParticipants,fetchHouses}:Readonly<Props>){
    const [query, setQuery] = useState("");

    return <Card>
        <CardContent>
            <CardHeader className='flex w-full'>
                <div className='flex flex-1 items-center justify-between gap-2'>
                    <h2 className='text-lg font-semibold'>Participants</h2>
                    <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchHouses} onCreate={createNewParticipant}/>
                </div>
            </CardHeader>
                    <ScrollArea className={"w-full flex-1"}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>First Name</TableHead>
                                    <TableHead>Last Name</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead className='hidden md:table-cell'>
                                        Age
                                    </TableHead>
                                    <TableHead className='hidden md:table-cell'>
                                        House
                                    </TableHead>
                                    <TableHead className='w-24 text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participants.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className='text-center py-8 text-muted-foreground'>
                                            <div className={"flex items-center flex-col gap-4"}>
                                                No Participants found. Create one below.
                                                <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchHouses} onCreate={createNewParticipant}/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    participants.sort((a,b)=>{
                                        return `${a.firstName} ${a.lastName}` > `${b.firstName} ${b.lastName}`?1:-1
                                    }).map((participant) => (
                                        <ParticipantCard
                                            key={participant.id}
                                            houses={houses}
                                            createHouse={createHouse}
                                            fetchHouses={fetchHouses}
                                            participant={participant}
                                            onUpdate={updateParticipant}
                                            house={houses.find((h)=>h.id===participant.houseId)??null}
                                            onDelete={deleteParticipant}
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