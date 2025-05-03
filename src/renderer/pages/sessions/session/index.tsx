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
import ParticipantDialogForm from "~/components/participant-dialog-form";
import Events from "~/pages/sessions/session/components/Events";

export default function SessionViewPage() {
  const { id } = useParams();
  const { session, importEventsFromMainStore, events, fetchSessionEvents } =
    useSessionHelper(id);
  const [activeTab, setActiveTab] = useState("events");

  useEffect(() => {}, []);

  return (
    <div className='p-4'>
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
          <Events sessionId={id}/>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value='participants'>
          <Card>

            <CardContent>
              <CardHeader className='flex w-full'>
              <div className='flex flex-1 items-center justify-between gap-2'>
                <h2 className='text-lg font-semibold'>Participants</h2>
                <ParticipantDialogForm sessionId={id} onCreate={async(data)=>{}}/>
              </div>
            </CardHeader>
            <div className='p-4 text-center text-muted-foreground'>
                <p>No participants found. Add participants to this session.</p>
              <ParticipantDialogForm sessionId={id} onCreate={async(data)=>{}}/>
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




