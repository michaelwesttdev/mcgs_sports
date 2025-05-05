import { Button } from "@/renderer/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/renderer/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSessionHelper } from "./components/useSessionHelper";
import Events from "~/pages/sessions/session/components/Events";
import Participants from "~/pages/sessions/session/components/Participants";
import Houses from "~/pages/sessions/session/components/Houses";

export default function SessionViewPage() {
  const { id } = useParams();
  const { session, importEventsFromMainStore, events, fetchSessionEvents,createEvent,updateEvent,deleteEvent,createParticipant,updateParticipant,deleteParticipant,fetchSessionParticipants,fetchSessionHouses,updateHouse,deleteHouse,createHouse,participants,houses,createEventResult,updateEventResult,deleteEventResult,fetchSessionEventResults,eventResults } =
    useSessionHelper(id);
  const [activeTab, setActiveTab] = useState("events");

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

  if(!id) return null;

  return (
    <div className='p-4'>
      {/* header */}
      <div className='flex items-center justify-between pb-3 border-b border-gray-200'>
        <div>
          <h1 className='text-xl font-bold'>Session {session?.title ?? ""}</h1>
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
          <Events participants={participants} houses={houses} fetchSessionEvents={fetchSessionEvents}
                  importEventsFromMainStore={importEventsFromMainStore} events={events} createEvent={createEvent}
                  onUpdate={updateEvent} onDelete={deleteEvent} updateResult={updateEventResult} createResult={createEventResult}
                  deleteResult={deleteEventResult} results={eventResults} />
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value='participants'>
          <Participants createHouse={createHouse} fetchParticipants={fetchSessionParticipants} fetchHouses={fetchSessionHouses} updateParticipant={updateParticipant} deleteParticipant={deleteParticipant} createNewParticipant={createParticipant} houses={houses} participants={participants}/>
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value='houses'>
          <Houses createHouse={createHouse} fetchSessionHouses={fetchSessionHouses} participants={participants} houses={houses} onDelete={deleteHouse} onUpdate={updateHouse} results={eventResults}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}




