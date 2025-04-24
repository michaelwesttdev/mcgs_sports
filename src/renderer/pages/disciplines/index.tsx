import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { PlusCircle, Trash } from "lucide-react";
import NewSessionDialogForm from "@/renderer/components/NewSessionDialogForm";
import { useDiscipline } from "@/renderer/hooks/use_discipline";
import NewDisciplineDialogForm from "@/renderer/components/NewDisciplineDialogForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { DeleteModal } from "@/renderer/components/deleteModal";

export default function DisciplinesPage() {
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const { disciplines, deleteDiscipline } = useDiscipline();

  const filteredDisciplines = disciplines.filter(
    (discipline) =>
      discipline.name.toLowerCase().includes(searchName.toLowerCase()) &&
      discipline.type.toLowerCase().includes(searchType.toLowerCase())
  );

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Disciplines</h1>
        <NewDisciplineDialogForm />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Input
          placeholder='Search by name'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Select value={searchType} onValueChange={(v) => setSearchType(v)}>
          <SelectTrigger>
            <SelectValue placeholder='Filter by type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='performance'>Performance</SelectItem>
            <SelectItem value='team'>Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {filteredDisciplines.map((discipline) => (
          <Card key={discipline.id} className='rounded-2xl shadow-md'>
            <CardContent className='p-4 flex items-center'>
              <div className='flex-1'>
                <h2 className='text-lg font-semibold'>{discipline.name}</h2>
                <p className='text-sm text-gray-500'>Type: {discipline.type}</p>
              </div>
              <aside className='grid gap-3'>
                <DeleteModal
                  itemName={`Discipline: ${discipline.name}`}
                  onDelete={async () => await deleteDiscipline(discipline.id)}
                  trigger={
                    <Button
                      variant='destructive'
                      className='w-6 h-6'
                      size='icon'>
                      <Trash />
                    </Button>
                  }
                />
                <NewDisciplineDialogForm
                  discipline={discipline}
                  purpose='edit'
                />
              </aside>
            </CardContent>
          </Card>
        ))}
        {filteredDisciplines.length === 0 && (
          <>
            <p className='text-center text-gray-500'>No disciplines found.</p>
            <NewDisciplineDialogForm />
          </>
        )}
      </div>
    </div>
  );
}
