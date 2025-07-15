import { Button } from "@/renderer/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/renderer/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useSessionHelper } from "./components/useSessionHelper";
import Events from "~/pages/sessions/session/components/Events";
import Participants from "~/pages/sessions/session/components/Participants";
import Houses from "~/pages/sessions/session/components/Houses";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/renderer/components/ui/dialog";
import Print from "@/renderer/components/print";
import { ArrowLeft, Printer } from "lucide-react";
import { useSettings } from "@/renderer/hooks/use_settings";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { useSessionSettings } from "./components/hooks/use_settings";
import SettingsPage from "./components/Settings";
import { useSessionState } from "./components/SessionStateContext";

export default function SessionViewPage() {
  const [params] = useSearchParams();
  const {sessionId,session} = useSessionState();
  const [activeTab, setActiveTab] = useState("events");
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const navigate = useNavigate()

  if (!sessionId) return null;
  const tab = params.get("tab")

  useEffect(()=>{
    if(tab){
      setActiveTab(tab)
    }
  },[])

  return (
    <div className='p-4 flex-1 flex flex-col'>
      {/* header */}
      {/* tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-4 flex flex-col w-full h-full'>
      <div className='flex flex-col justify-between pb-3 border-b border-gray-200 sticky top-0 z-20 bg-white'>
        <div className="flex items-center gap-5">
          <Button onClick={()=>{
            navigate("/sessions")
          }} size="icon">
            <ArrowLeft/>
          </Button>
          <h1 className='text-xl font-bold'>Session: {session?.title ?? ""}</h1>
          <PrintDialog
            isOpen={printDialogOpen}
            setIsOpen={setPrintDialogOpen}
            id={sessionId}
            sessionId={sessionId}
            title={`Print Session ${session?.title ?? ""}`} />
        </div>
        <TabsList className='grid grid-cols-4 w-full max-w-md mt-4'>
          <TabsTrigger value='events'>Events</TabsTrigger>
          <TabsTrigger value='participants'>Participants</TabsTrigger>
          <TabsTrigger value='houses'>Houses</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
      </div>

        {/* Events Tab */}
        <TabsContent value='events' className="flex-1 flex flex-col">
          <Events/>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value='participants'>
          <Participants/>
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value='houses'>
          <Houses/>
        </TabsContent>
        {/* Settings Tab */}
        <TabsContent value='settings'>
          <SettingsPage/>
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




