import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { PlusCircle } from "lucide-react";
import NewSessionDialogForm from "@/renderer/components/NewSessionDialogForm";
import { useSession } from "@/renderer/hooks/use_session";
import { useDiscipline } from "@/renderer/hooks/use_discipline";
type Props = {};

export default function SessionsPage({}: Props) {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDescipline, setSearchDescipline] = useState("");
  const {sessions} = useSession();
  const {disciplines} = useDiscipline()

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      session.disciplineId===searchDescipline
  );

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Sessions</h1>
        <NewSessionDialogForm />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Input
          placeholder='Search by title'
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <Input
          placeholder='Search by descipline'
          value={searchDescipline}
          onChange={(e) => setSearchDescipline(e.target.value)}
        />
      </div>

      <div className='grid gap-4'>
        {filteredSessions.map((session) => (
          <Card key={session.id} className='rounded-2xl shadow-md'>
            <CardContent className='p-4'>
              <h2 className='text-lg font-semibold'>{session.title}</h2>
              <p className='text-sm text-gray-500'>
                Descipline: {disciplines.find(d=>d.id===session.disciplineId)?.name}
              </p>
              <p className='text-sm text-gray-500'>Year: {new Date(session.date).getFullYear()}</p>
            </CardContent>
          </Card>
        ))}
        {filteredSessions.length === 0 && (
          <p className='text-center text-gray-500'>No sessions found.</p>
        )}
      </div>
    </div>
  );
}
