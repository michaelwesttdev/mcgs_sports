import { Button } from "@/renderer/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";
import { useParams } from "react-router";
import { useSessionHelper } from "./components/useSessionHelper";
import { Badge } from "@/renderer/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";
import { Edit2, Save } from "lucide-react";
import { PSEvent } from "@/db/sqlite/p_sports/schema";

export default function SessionViewPage() {
  const { id } = useParams();
  const [query, setQuery] = useState("");
  const { session, importEventsFromMainStore, events } = useSessionHelper(id);
  const [activeTab, setActiveTab] = useState("events");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number | null>(null);

  return (
    <div className='container'>
      {/* header */}
      <div className='flex items-center justify-between pb-3 border-b border-gray-200'>
        <div>
          <h1 className='text-xl font-bold'>Session {session?.title ?? ""}</h1>
        </div>
        <div>
          <Button
            onClick={() => importEventsFromMainStore()}
            aria-description='Import Events from main store'>
            Import Events
          </Button>
        </div>
      </div>
      {/* tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-4'>
        <TabsList className='grid grid-cols-3 w-full max-w-md'>
          <TabsTrigger value='events'>Events</TabsTrigger>
          <TabsTrigger value='participants'>Participants</TabsTrigger>
          <TabsTrigger value='houses'>Houses</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value='events'>
          <Card className='w-full'>
            <CardHeader>
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
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-20'>Event #</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Record Holder
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Record
                    </TableHead>
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
                    events.map((event) => (
                      <Event
                        key={event.id}
                        event={event}
                        onupdate={() => {}}
                        ondelete={() => {}}
                        onupdateresults={() => {}}
                        editingId={editingId}
                        setEditingId={setEditingId}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value='participants'>
          <Card>
            <CardHeader className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Participants</h2>
            </CardHeader>
            <CardContent>
              <div className='p-4 text-center text-muted-foreground'>
                <p>No participants found. Add participants to this session.</p>
                <Button className='mt-4'>Add Participant</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value='houses'>
          <Card>
            <CardHeader className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Houses</h2>
            </CardHeader>
            <CardContent>
              <div className='p-4 text-center text-muted-foreground'>
                <p>No houses found. Add houses to this session.</p>
                <Button className='mt-4'>Add House</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type EventProps = {
  event: PSEvent;
  onupdate: (event: PSEvent) => void;
  ondelete: (event: PSEvent) => void;
  onupdateresults: (event: PSEvent) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
};

function Event({ event, editingId, setEditingId }: EventProps) {
  const [eventNumber, setEventNumber] = useState(event.eventNumber.toString());
  const [editForm, setEditForm] = useState({
    eventNumber,
    recordHolder: "",
    record: "",
    recordingMetric: "",
  });
  const handleEdit = (event: PSEvent) => {
    setEditingId(event.id);
    setEditForm({
      eventNumber: event.eventNumber.toString(),
      recordHolder: event.recordHolder || "",
      record: event.record || "",
      recordingMetric: event.recordingMetric || "",
    });
    setEventNumber(event.eventNumber.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event: PSEvent) => {
    try {
      //do something
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };
  return (
    <TableRow key={event.id}>
      <TableCell>
        {editingId === event.id ? (
          <Input
            type='number'
            name='eventNumber'
            value={editForm.eventNumber !== null ? editForm.eventNumber : ""}
            onChange={(e) => handleChange(e)}
            className='w-full max-w-28'
          />
        ) : (
          event.eventNumber || "-"
        )}
      </TableCell>
      <TableCell className='font-medium'>{event.title}</TableCell>
      <TableCell className='hidden md:table-cell'>
        {editingId === event.id ? (
          <Input
            type='text'
            name='recordHolder'
            value={editForm.recordHolder !== null ? editForm.recordHolder : ""}
            onChange={(e) => handleChange(e)}
            className='w-full max-w-28'
          />
        ) : (
          event.recordHolder || "-"
        )}
      </TableCell>
      <TableCell className='hidden md:table-cell'>
        {editingId === event.id ? (
          <Input
            type='text'
            name='record'
            value={editForm.record !== null ? editForm.record : ""}
            onChange={(e) => handleChange(e)}
            className='w-full max-w-28'
          />
        ) : event.record ? (
          `${event.record} ${event.recordingMetric || ""}`
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className='text-right'>
        {editingId === event.id ? (
          <Button size='sm' variant='ghost' onClick={() => handleSave(event)}>
            <Save className='h-4 w-4' />
            <span className='sr-only'>Save</span>
          </Button>
        ) : (
          <Button size='sm' variant='ghost' onClick={() => handleEdit(event)}>
            <Edit2 className='h-4 w-4' />
            <span className='sr-only'>Edit</span>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
