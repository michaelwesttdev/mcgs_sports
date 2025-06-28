import { Button } from "@/renderer/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/renderer/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSessionHelper } from "./components/useSessionHelper";
import Events from "~/pages/sessions/session/components/Events";
import Participants from "~/pages/sessions/session/components/Participants";
import Houses from "~/pages/sessions/session/components/Houses";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/renderer/components/ui/dialog";
import Print from "@/renderer/components/print";
import { ArrowLeft, Printer } from "lucide-react";
import { useSettings } from "@/renderer/hooks/use_settings";
import { Checkbox } from "@/renderer/components/ui/checkbox";

export default function SessionViewPage() {
  const { id } = useParams();
  const { session, importEventsFromMainStore, events, fetchSessionEvents, createEvent, updateEvent, deleteEvent, createParticipant, updateParticipant, deleteParticipant, fetchSessionParticipants, fetchSessionHouses, updateHouse, deleteHouse, createHouse, participants, houses, createEventResult, updateEventResult, deleteEventResult, fetchSessionEventResults, eventResults } =
    useSessionHelper(id);
  const [activeTab, setActiveTab] = useState("events");
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      (async () => {
        await window.api.handleSessionDbCreate(id);
      })();
    }
    return () => {
      window.api.handleSessionDbClose(id);
    };
  }, []);

  if (!id) return null;

  return (
    <div className='p-4'>
      {/* header */}
      <div className='flex items-center justify-between pb-3 border-b border-gray-200'>
        <div className="flex items-center gap-5">
          <Button onClick={()=>{
            navigate("/sessions")
          }} size="icon">
            <ArrowLeft/>
          </Button>
          <h1 className='text-xl font-bold'>Session {session?.title ?? ""}</h1>
          <PrintDialog
            isOpen={printDialogOpen}
            setIsOpen={setPrintDialogOpen}
            id={id}
            sessionId={id}
            title={`Print Session ${session?.title ?? ""}`} />
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
          <Events sessionId={id} participants={participants} houses={houses} fetchSessionEvents={fetchSessionEvents}
            importEventsFromMainStore={importEventsFromMainStore} events={events} createEvent={createEvent}
            onUpdate={updateEvent} onDelete={deleteEvent} updateResult={updateEventResult} createResult={createEventResult}
            deleteResult={deleteEventResult} results={eventResults} />
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value='participants'>
          <Participants createHouse={createHouse} fetchParticipants={fetchSessionParticipants} fetchHouses={fetchSessionHouses} updateParticipant={updateParticipant} deleteParticipant={deleteParticipant} createNewParticipant={createParticipant} houses={houses} participants={participants} />
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value='houses'>
          <Houses createHouse={createHouse} fetchSessionHouses={fetchSessionHouses} participants={participants} houses={houses} onDelete={deleteHouse} onUpdate={updateHouse} results={eventResults} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function PrintDialog({ isOpen = false, id, sessionId, title = "Print Event", setIsOpen }: { isOpen: boolean, id: string, sessionId: string, title?: string, setIsOpen: (v: boolean) => void }) {
  const [maxPositions, setMaxPositions] = useState(3);
  const [includePageBreaks, setIncludePageBreaks] = useState(false);
  const [printOnlyCompletedEvents, setPrintOnlyCompletedEvents] = useState(false);
  //const {settings} = useSettings(); # for future use, settings will return a value for max positions in an event
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span className="flex items-center gap-2">
            <Printer className={"w-4 h-4"} />
            Print Session
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="maxPositions">Max Positions per Event To Print:</label>
            <input
              type="number"
              id="maxPositions"
              value={maxPositions}
              min={2}
              onChange={(e) => setMaxPositions(Number(e.target.value))}
              className="border rounded p-1 w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="includePageBreaks">Include Page Breaks:</label>
            <Checkbox checked={includePageBreaks} onCheckedChange={() => setIncludePageBreaks(!includePageBreaks)} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="printOnlyCompletedEvents">Print Only Completed Events:</label>
            <Checkbox checked={printOnlyCompletedEvents} onCheckedChange={() => setPrintOnlyCompletedEvents(!printOnlyCompletedEvents)} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 min-w-[300px]">
          <Button onClick={() => setIsOpen(false)} variant="destructive">Cancel</Button>
          <Print printOptions={{
            maxPositions,
            includePageBreaks,
            printOnlyCompletedEvents
          }} onDone={() => setIsOpen(false)} sessionId={sessionId} type="session" />
        </div>
      </DialogContent>
    </Dialog>
  )
}




