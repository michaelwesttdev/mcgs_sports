import { MSession } from "@/db/sqlite/main/schema";
import { PSEvent } from "@/db/sqlite/p_sports/schema";
import { Toast } from "@/renderer/components/Toast";
import { useEvents } from "@/renderer/hooks/use_events";
import { useSession } from "@/renderer/hooks/use_session";
import { useEffect, useState } from "react";

export function useSessionHelper(sessionId: string) {
  const { getSession } = useSession();
  const { events: mainEvents, listAllEvents } = useEvents();
  const [session, setSession] = useState<MSession | undefined>(undefined);
  const [events, setEvents] = useState<PSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  async function fetchSession() {
    const session = await getSession(sessionId);
    setSession(session);
    setLoading(false);
  }
  async function fetchSessionEvents() {
    if (!sessionId) return;
    try {
      const events = await window.api.psListEvent(sessionId);
      if (!events.success) throw new Error(events.error);
      setEvents(events.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Toast({ message: "Error fetching session events", variation: "error" });
    }
  }
  async function importEventsFromMainStore() {
    setLoading(true);
    try {
      await listAllEvents();
      const mainStoreEvents = mainEvents;
      const sessionEventsRes = await window.api.psListEvent(sessionId);
      if (!sessionEventsRes.success) throw new Error(sessionEventsRes.error);
      const sessionEvents = sessionEventsRes.data as PSEvent[];
      const eventsToImport = mainStoreEvents.filter(
        (event) =>
          !sessionEvents.find((se) => se.id === event.id) &&
          event.disciplineId === session?.disciplineId
      );
      console.log(eventsToImport);
      const insertedEvents = await window.api.psCreateEvent([
        sessionId,
        eventsToImport,
      ]);
      if (!insertedEvents.success) throw new Error(insertedEvents.error);
      await fetchSessionEvents();
      Toast({
        message: "Events imported successfully",
        variation: "success",
      });
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (sessionId) {
      (async () => {
        await window.api.handleSessionDbCreate(sessionId);
        await fetchSession();
        await fetchSessionEvents();
      })();
    }
    return () => {
      window.api.handleSessionDbClose(sessionId);
    };
  }, [sessionId]);
  return {
    session,
    loading,
    query,
    setQuery,
    importEventsFromMainStore,
    fetchSessionEvents,
    events,
  };
}
