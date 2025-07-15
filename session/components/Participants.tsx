import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useState, useRef } from "react";
import { PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import ParticipantDialogForm from "~/components/participant-dialog-form";
import ParticipantCard from "~/pages/sessions/session/components/ParticipantCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/renderer/components/ui/dropdown-menu";
import { Button } from "@/renderer/components/ui/button";
import ParticipantsCsvImport from "./participantsCsvImport";
import { useSessionState } from "./SessionStateContext";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function Participants() {
    const { houses, participants, createHouse, deleteParticipant, createParticipant, updateParticipant, fetchSessionParticipants, fetchSessionHouses } = useSessionState();
    const [query, setQuery] = useState("");

    const filtered = participants.filter((p) => { 
        const matchesFirstname = p.firstName.toLowerCase().includes(query.toLowerCase());
        const matchesLastname = p.lastName.toLowerCase().includes(query.toLowerCase());
        const matchesHouse = houses.find(h => h.id === p.houseId)?.name.toLowerCase().includes(query.toLowerCase()) ?? false;
        return matchesFirstname || matchesLastname || matchesHouse;
    }).sort((a, b) => {
        return `${a.firstName} ${a.lastName}` > `${b.firstName} ${b.lastName}` ? 1 : -1
    });

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: filtered.length,
        getScrollElement:()=>parentRef.current,
        estimateSize: () => 50, // Estimate the size of each row
        overscan: 5,
    });

    return <Card className="relative">
        <CardContent className="flex-col">
            <CardHeader className='flex w-full sticky top-24 bg-white z-30'>
                <div className='flex flex-1 items-center justify-between gap-2'>
                    <div className='flex flex-1 items-center gap-2'>
                        <h2 className='text-lg font-semibold'>Participants</h2>
                        <div className='flex-1 flex gap-8 items-center justify-between p-3'>
                            <div className='flex-1'>
                                <Input
                                    placeholder='Search by Firstname, Lastname or house'
                                    className='max-w-60'
                                    onChange={(e) => setQuery(e.target.value)}
                                    value={query}
                                />
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>Add</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="grid gap-3">
                            <DropdownMenuItem asChild>
                                <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchSessionHouses} onCreate={createParticipant} />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <ParticipantsCsvImport houses={houses} createHouse={createHouse} fetchHouses={fetchSessionHouses} participants={participants} createNewParticipant={createParticipant} fetchParticipants={fetchSessionParticipants} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <ScrollArea className={"w-full overflow-hidden"} ref={parentRef}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead className='hidden md:table-cell'>Age</TableHead>
                            <TableHead className='hidden md:table-cell'>House</TableHead>
                            <TableHead className='w-24 text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                        {participants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                                    <div className={"flex items-center flex-col gap-4"}>
                                        No Participants found. Create one below.
                                        <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchSessionHouses} onCreate={createParticipant} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                                    <div className={"flex items-center flex-col gap-4"}>
                                        No Participants Match Your Search. Create one below.
                                        <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchSessionHouses} onCreate={createParticipant} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rowVirtualizer.getVirtualItems().map((virtualItem) => {
                                const participant = filtered[virtualItem.index];
                                return (
                                    <ParticipantCard
                                        key={participant.id}
                                        houses={houses}
                                        createHouse={createHouse}
                                        fetchHouses={fetchSessionHouses}
                                        participant={participant}
                                        onUpdate={updateParticipant}
                                        house={houses.find((h) => h.id === participant.houseId) ?? null}
                                        onDelete={deleteParticipant}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: `${virtualItem.size}px`,
                                            transform: `translateY(${virtualItem.start}px)`,
                                        }}
                                    />
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation={"horizontal"} />
            </ScrollArea>
        </CardContent>
    </Card>
}