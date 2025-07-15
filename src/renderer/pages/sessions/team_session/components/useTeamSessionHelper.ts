
import { MSession } from "@/db/sqlite/main/schema";
import { TSTeam, TSPlayer, TSFixture, TSFixtureEvent, TSFixtureParticipant, TSPlayerFixtureStats } from "@/db/sqlite/t_sports/new_schema";
import { Toast } from "@/renderer/components/Toast";
import { useEvents } from "@/renderer/hooks/use_events";
import { useSession } from "@/renderer/hooks/use_session";
import { useEffect, useState } from "react";
import {nanoid} from "nanoid";

export function useTeamSessionHelper(sessionId: string) {
  const { getSession } = useSession();
  const [session, setSession] = useState<MSession | undefined>(undefined);
  const [teams, setTeams] = useState<TSTeam[]>([]);
  const [players, setPlayers] = useState<TSPlayer[]>([]);
  const [fixtures, setFixtures] = useState<TSFixture[]>([]);
  const [fixtureEvents, setFixtureEvents] = useState<TSFixtureEvent[]>([]);
  const [fixtureParticipants, setFixtureParticipants] = useState<TSFixtureParticipant[]>([]);
  const [playerFixtureStats, setPlayerFixtureStats] = useState<TSPlayerFixtureStats[]>([]);

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function fetchSession() {
    const session = await getSession(sessionId);
    setSession(session);
    setLoading(false);
  }

  const refresh = async () => {
    await fetchSession();
    // Mock data for now
    setTeams([
      { id: '1', name: 'Team A', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '2', name: 'Team B', createdAt: '', updatedAt: '', deletedAt: null },
    ]);
    setPlayers([
      { id: '1', name: 'Player 1', teamId: '1', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '2', name: 'Player 2', teamId: '1', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '3', name: 'Player 3', teamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '4', name: 'Player 4', teamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
    ]);
    setFixtures([
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 1', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
      { id: '1', name: 'Fixture 11', category: 'football', gender: 'boys', round: 'final', date: '2025-07-15', homeTeamId: '1', awayTeamId: '2', createdAt: '', updatedAt: '', deletedAt: null },
    ]);
    setFixtureParticipants([
        { fixtureId: '1', teamId: '1', score: 2, position: 1, createdAt: '', updatedAt: '', deletedAt: null },
        { fixtureId: '1', teamId: '2', score: 1, position: 2, createdAt: '', updatedAt: '', deletedAt: null },
    ]);
  }

  useEffect(() => {
    if (sessionId) {
      refresh().catch(e=>console.error(e));
    }
  }, [sessionId]);

  return {
    session,
    loading,
    query,
    setQuery,
    teams,
    players,
    fixtures,
    fixtureEvents,
    fixtureParticipants,
    playerFixtureStats,
  };
}
