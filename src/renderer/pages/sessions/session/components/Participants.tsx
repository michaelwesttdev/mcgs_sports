import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useState } from "react";
import { PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import ParticipantDialogForm from "~/components/participant-dialog-form";
import ParticipantCard from "~/pages/sessions/session/components/ParticipantCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/renderer/components/ui/dropdown-menu";
import { Button } from "@/renderer/components/ui/button";
import ParticipantsCsvImport from "./participantsCsvImport";

interface Props {
    houses: PSHouse[];
    participants: PSParticipant[];
    createNewParticipant: (participant: Omit<PSParticipant, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    updateParticipant: (id: string, data: Partial<PSParticipant>) => Promise<void>;
    deleteParticipant: (id: string) => Promise<void>;
    fetchHouses: () => Promise<void>;
    fetchParticipants: () => Promise<void>;
    createHouse: (house: Omit<PSHouse, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}
export default function Participants({ houses, participants, createHouse, deleteParticipant, createNewParticipant, updateParticipant, fetchParticipants, fetchHouses }: Readonly<Props>) {
    const [query, setQuery] = useState("");
    const filtered = participants.filter((p) => {
        const matchesFirstname = p.firstName.toLowerCase().includes(query.toLowerCase());
        const matchesLastname = p.lastName.toLowerCase().includes(query.toLowerCase());
        const matchesHouse = houses.find(h => h.id === p.houseId)?.name.toLowerCase().includes(query.toLowerCase()) ?? false;
        return matchesFirstname || matchesLastname || matchesHouse;
    });

    return <Card>
        <CardContent>
            <CardHeader className='flex w-full'>
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
                                <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchHouses} onCreate={createNewParticipant} />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <ParticipantsCsvImport houses={houses} createHouse={createHouse} fetchHouses={fetchHouses} participants={participants} createNewParticipant={createNewParticipant} fetchParticipants={fetchParticipants}/>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                        <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchHouses} onCreate={createNewParticipant} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) :
                            filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className='text-center py-8 text-muted-foreground'>
                                        <div className={"flex items-center flex-col gap-4"}>
                                            No Participants Match Your Search. Create one below.
                                            <ParticipantDialogForm createHouse={createHouse} houses={houses} fetchHouses={fetchHouses} onCreate={createNewParticipant} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.sort((a, b) => {
                                    return `${a.firstName} ${a.lastName}` > `${b.firstName} ${b.lastName}` ? 1 : -1
                                }).map((participant) => (
                                    <ParticipantCard
                                        key={participant.id}
                                        houses={houses}
                                        createHouse={createHouse}
                                        fetchHouses={fetchHouses}
                                        participant={participant}
                                        onUpdate={updateParticipant}
                                        house={houses.find((h) => h.id === participant.houseId) ?? null}
                                        onDelete={deleteParticipant}
                                    />
                                ))
                            )}
                    </TableBody>
                </Table>
                <ScrollBar orientation={"horizontal"} />
            </ScrollArea>
        </CardContent>
    </Card>
}