
import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { TSPlayer } from "@/db/sqlite/t_sports/new_schema";
import { useState } from "react";

interface PlayerStatsDialogProps {
  player: TSPlayer;
  onSave: (stats: { key: string; value: string }[]) => void;
}

export function PlayerStatsDialog({ player, onSave }: PlayerStatsDialogProps) {
  const [stats, setStats] = useState<{ key: string; value: string }[]>([]);

  const handleAddStat = () => {
    setStats([...stats, { key: "", value: "" }]);
  };

  const handleStatChange = (index: number, field: 'key' | 'value', value: string) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Enter Stats</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Stats for {player.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {stats.map((stat, index) => (
            <div key={index} className="grid grid-cols-3 items-center gap-4">
              <Input
                placeholder="Stat Key (e.g., goals)"
                value={stat.key}
                onChange={(e) => handleStatChange(index, 'key', e.target.value)}
              />
              <Input
                placeholder="Stat Value"
                value={stat.value}
                onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                className="col-span-2"
              />
            </div>
          ))}
          <Button onClick={handleAddStat} variant="outline">Add Stat</Button>
        </div>
        <Button onClick={() => onSave(stats)}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
