import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Toast } from "../components/Toast";
import { MEvent } from "@/db/sqlite/main/schema";

type Props = { children: React.ReactNode };

interface EventContextProps {
  listAllEvents: () => void;
  createEvent: (
    event: Omit<MEvent, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  updateEvent: (id: string, discipline: Partial<MEvent>) => Promise<boolean>;
  events: MEvent[];
  loading: boolean;
  error: Error | null;
}

export const EventContext = React.createContext<EventContextProps>({
  listAllEvents: () => {},
  createEvent: () => Promise.resolve(false),
  deleteEvent: () => Promise.resolve(false),
  updateEvent: () => Promise.resolve(false),
  events: [],
  loading: false,
  error: null,
});

export default function EventContextProvider({ children }: Props) {
  const [events, setEvents] = useState<MEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  async function listAllEvents() {
    setLoading(true);
    try {
      const response = await window.api.mainListEvent(undefined);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setEvents(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  async function createEvent(
    event: Omit<MEvent, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) {
    setLoading(true);
    try {
      const id = nanoid();
      const response = await window.api.mainCreateEvent({
        id,
        ...event,
      });
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setEvents((prev) => [...prev, data]);
      Toast({
        message: "Event created successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function deleteEvent(id: string) {
    setLoading(true);
    try {
      const response = await window.api.mainDeleteEvent(id);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setEvents((prev) => prev.filter((event) => event.id !== id));
      Toast({
        message: "Event deleted successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function updateEvent(id: string, discipline: Partial<Event>) {
    setLoading(true);
    try {
      const response = await window.api.mainUpdateEvent([id, discipline]);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? data : event))
      );
      Toast({
        message: "Event updated successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    (async () => {
      await listAllEvents();
    })();
  }, []);
  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        listAllEvents,
        createEvent,
        deleteEvent,
        updateEvent,
      }}>
      {children}
    </EventContext.Provider>
  );
}
