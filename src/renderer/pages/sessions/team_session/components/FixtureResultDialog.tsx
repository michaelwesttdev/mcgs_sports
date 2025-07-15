
import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { TSFixture, TSTeam } from "@/db/sqlite/t_sports/new_schema";
import { useState } from "react";

interface FixtureResultDialogProps {
  fixture: TSFixture;
  teams: TSTeam[];
  onSave: (homeScore: number, awayScore: number) => void;
}

export function FixtureResultDialog({ fixture, teams, onSave }: FixtureResultDialogProps) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const homeTeam = teams.find(t => t.id === fixture.homeTeamId);
  const awayTeam = teams.find(t => t.id === fixture.awayTeamId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Enter Result</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Result for {fixture.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="home-score" className="text-right">
              {homeTeam?.name}
            </Label>
            <Input
              id="home-score"
              type="number"
              value={homeScore}
              onChange={(e) => setHomeScore(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="away-score" className="text-right">
              {awayTeam?.name}
            </Label>
            <Input
              id="away-score"
              type="number"
              value={awayScore}
              onChange={(e) => setAwayScore(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={() => onSave(homeScore, awayScore)}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
