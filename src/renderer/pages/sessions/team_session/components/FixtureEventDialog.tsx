
import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { TSFixture } from "@/db/sqlite/t_sports/new_schema";
import { useState } from "react";

interface FixtureEventDialogProps {
  fixture: TSFixture;
  onSave: (eventType: string) => void;
}

export function FixtureEventDialog({ fixture, onSave }: FixtureEventDialogProps) {
  const [eventType, setEventType] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event to {fixture.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-type" className="text-right">
              Event Type
            </Label>
            <Input
              id="event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={() => onSave(eventType)}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
