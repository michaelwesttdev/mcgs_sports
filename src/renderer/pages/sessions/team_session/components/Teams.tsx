
import { useSessionState } from "./SessionStateContext";

export default function Teams() {
  const { teams } = useSessionState();

  return (
    <div>
      <h2 className="text-lg font-semibold">Teams</h2>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {teams.map((team) => (
          <div key={team.id} className="p-4 border rounded-lg">
            <h3 className="font-bold">{team.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
