
import { useSessionState } from "./SessionStateContext";

export default function Players() {
  const { players, teams } = useSessionState();

  return (
    <div>
      <h2 className="text-lg font-semibold">Players</h2>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {players.map((player) => (
          <div key={player.id} className="p-4 border rounded-lg">
            <h3 className="font-bold">{player.name}</h3>
            <p>{teams.find(t => t.id === player.teamId)?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
