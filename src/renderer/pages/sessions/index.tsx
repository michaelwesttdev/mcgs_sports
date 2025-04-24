import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { PlusCircle } from "lucide-react";
import NewSessionDialogForm from "@/renderer/components/NewSessionDialogForm";

const sessionsData = [
  {
    id: 1,
    name: "MCC Interhouse athletics",
    category: "Athletics",
    year: "2024",
  },
  { id: 2, name: "MCS Swimming gala", category: "Swimming", year: "2025" },
];
type Props = {};

export default function SessionsPage({}: Props) {
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchYear, setSearchYear] = useState("");

  const filteredSessions = sessionsData.filter(
    (session) =>
      session.name.toLowerCase().includes(searchName.toLowerCase()) &&
      session.category.toLowerCase().includes(searchCategory.toLowerCase()) &&
      session.year.includes(searchYear)
  );

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Sessions</h1>
        <NewSessionDialogForm />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Input
          placeholder='Search by name'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Input
          placeholder='Search by category'
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        />
        <Input
          placeholder='Search by year'
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        />
      </div>

      <div className='grid gap-4'>
        {filteredSessions.map((session) => (
          <Card key={session.id} className='rounded-2xl shadow-md'>
            <CardContent className='p-4'>
              <h2 className='text-lg font-semibold'>{session.name}</h2>
              <p className='text-sm text-gray-500'>
                Category: {session.category}
              </p>
              <p className='text-sm text-gray-500'>Year: {session.year}</p>
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
