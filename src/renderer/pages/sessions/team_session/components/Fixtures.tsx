
import { Search } from "lucide-react";
import { useSessionState } from "./SessionStateContext";
import { Input } from "@/renderer/components/ui/input";
import { useState } from "react";
import ScrollBox from "@/renderer/components/ScrollBox";

export default function Fixtures() {
  const { fixtures, teams } = useSessionState();
    const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="shrink-0 px-4 py-2 flex justify-between items-center border-b">
        <div className="flex flex-col items-start gap-3">
          <h1 className="text-lg font-bold">Fixtures ({5})</h1>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollBox className="grid grid-cols-1 gap-4 mt-4 flex-1 overflow-y-auto pb-20">
        {fixtures.map((fixture) => (
          <div key={fixture.id} className="p-4 border rounded-lg mt-4">
            <h3 className="font-bold">{fixture.name}</h3>
            <p>{fixture.category} - {fixture.gender} - {fixture.round}</p>
            <p>{teams.find(t => t.id === fixture.homeTeamId)?.name} vs {teams.find(t => t.id === fixture.awayTeamId)?.name}</p>
          </div>
        ))}
      </ScrollBox>
    </div>
  );
}
