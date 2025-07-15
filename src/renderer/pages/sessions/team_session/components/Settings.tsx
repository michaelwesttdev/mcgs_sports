import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { Plus, Trash2, Save } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Toast } from "~/components/Toast";
import { TSessionSettings, Settings } from "@/shared/settings";
import { useSettings } from "~/hooks/use_settings";
import { useSessionSettings } from "./hooks/use_settings";
import { cn } from "@/renderer/lib/utils";
import SettingsFromOtherDialog from "./settingsFromOtherDialog";
import ScrollBox from "@/renderer/components/ScrollBox";

export default function SettingsPage() {
  const { settings: defaultSettings, updateSettings } = useSessionSettings();
  const [settings, setSettings] = useState<TSessionSettings>(defaultSettings);
  // Stat Keys
  const [newStatKey, setNewStatKey] = useState("");

  // Event Types
  const [newEventType, setNewEventType] = useState("");

  // Add new stat key
  const addStatKey = () => {
    if (!newStatKey.trim()) {
      Toast({
        message: "Stat key is required",
        variation: "error",
      });
      return;
    }

    const exists = settings.statKeys.find(key=>key.toLowerCase===newStatKey.toLowerCase)
    if (exists) {
      Toast({
        message: "Stat Key Already Exists",
        variation: "error",
      });
      return;
    }

    const newSettings:TSessionSettings = {
      ...settings,
      statKeys: [...settings.statKeys,newStatKey]
    };
    saveSettings(newSettings);

    // Reset form
    setNewStatKey("");
  };

  // Remove stat key
  const removeStatKey = (name: string) => {
    const updatedStatKeys = [...settings.statKeys];
    const index = updatedStatKeys.indexOf(name);
    updatedStatKeys.splice(index, 1);

    const newSettings:TSessionSettings = {
      ...settings,
      statKeys: updatedStatKeys,
    };
    saveSettings(newSettings)
  };

  // Add new event Type
  const addEventType = () => {
if (!newEventType.trim()) {
      Toast({
        message: "Event Type is required",
        variation: "error",
      });
      return;
    }

    const exists = settings.eventTypes.find(type=>type.toLowerCase()===newEventType.toLowerCase())
    if (exists) {
      Toast({
        message: "Event Type Already Exists",
        variation: "error",
      });
      return;
    }

    const newSettings:TSessionSettings = {
      ...settings,
      eventTypes: [...settings.eventTypes,newEventType]
    };
    saveSettings(newSettings);

    // Reset form
    setNewEventType("");
  };

  // Remove Event Type
  const removeEventType = (name: string) => {
    const updatedEventTypes = [...settings.eventTypes];
    const index = updatedEventTypes.indexOf(name);
    updatedEventTypes.splice(index, 1);

    const newSettings:TSessionSettings = {
      ...settings,
      statKeys: updatedEventTypes,
    };
    saveSettings(newSettings)
  };
  const saveSettings = async (data?: Partial<TSessionSettings>) => {
    await updateSettings(data ? { settings: data } : { settings } as any);
    setSettings((data ?? settings) as TSessionSettings);
    Toast({
      message: "Settings saved",
      variation: "success",
    });
  };

  return (
    <div className="py-10 flex-1 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Session Settings</h1>
        <SettingsFromOtherDialog onDone={() => Promise.resolve()}/>
      </div>

      <Tabs defaultValue="general" className="w-full flex-1 h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="statKeys">Stat Keys</TabsTrigger>
          <TabsTrigger value="eventTypes">Event Types</TabsTrigger>
        </TabsList>

        <ScrollBox className="flex-1 pb-20">

        {/* General settings and rules Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Rules and Settings</CardTitle>
              <CardDescription>
                Configure general settings and rules for the session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  General Settings
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stat Keys Tab */}
        <TabsContent value="statKeys">
          <Card>
            <CardHeader>
              <CardTitle>Stat Keys</CardTitle>
              <CardDescription>
                Configure stat keys for competition stat records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center gap-6">
                          <div className="">
                            <Label>New Stat Key</Label>
                            <Input type="text" value={newStatKey} onChange={(e) => {
                              setNewStatKey(e.target.value)
                            }} />
                          </div>
                          <Button onClick={()=>addStatKey()} className={cn("w-full md:w-auto",!newStatKey?"hidden":"")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Stat Key
                          </Button>
                        </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Current Stat Keys
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="grid gap-4">
                      {settings.statKeys.map(
                        (statKey) => (
                          <div
                            key={statKey}
                            className="flex justify-between items-center p-2 rounded-md border"
                          >
                            <p>
                              {statKey}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStatKey(statKey)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Types Tab */}
        <TabsContent value="eventTypes">
          <Card>
            <CardHeader>
              <CardTitle>Points Allocation</CardTitle>
              <CardDescription>
                Configure points awarded for placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center gap-6">
                          <div className="">
                            <Label>New Event Type</Label>
                            <Input type="text" value={newEventType} onChange={(e) => {
                              setNewEventType(e.target.value)
                            }} />
                          </div>
                          <Button onClick={()=>addEventType()} className={cn("w-full md:w-auto",newEventType?"hidden":"")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Event Type
                          </Button>
                        </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Current Event Types
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="grid gap-4">
                      {settings.eventTypes.map(
                        (eventType) => (
                          <div
                            key={eventType}
                            className="flex justify-between items-center p-2 rounded-md border"
                          >
                            <p>
                              {eventType}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeEventType(eventType)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </ScrollBox>
      </Tabs>
    </div>
  );
} 