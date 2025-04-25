import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Toast } from "../components/Toast";
import { Session } from "@/shared/types/db";

type Props = { children: React.ReactNode };

interface SessionContextProps {
  listAllSessions: () => void;
  createSession: (
    session: Omit<Session, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Promise<boolean>;
  deleteSession: (id: string) => Promise<boolean>;
  updateSession: (
    id: string,
    session: Partial<Session>
  ) => Promise<boolean>;
  sessions: Session[];
  loading: boolean;
  error: Error | null;
}

export const SessionContext = React.createContext<SessionContextProps>({
  listAllSessions: () => {},
  createSession: () => Promise.resolve(false),
  deleteSession: () => Promise.resolve(false),
  updateSession: () => Promise.resolve(false),
  sessions: [],
  loading: false,
  error: null,
});

export default function SessionContextProvider({ children }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  async function listAllSessions() {
    setLoading(true);
    try {
      const response = await window.api.mainListSession(undefined);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setSessions(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  async function createSession(
    session: Omit<Session, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) {
    setLoading(true);
    try {
      const id = nanoid();
      const response = await window.api.mainCreateSession({
        id,
        ...session,
      });
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setSessions((prev) => [...prev, data]);
      Toast({
        message: "Session created successfully",
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
  async function deleteSession(id: string) {
    setLoading(true);
    try {
      const response = await window.api.mainDeleteSession(id);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setSessions((prev) =>
        prev.filter((session) => session.id!== id)
      );
      Toast({
        message: "Session deleted successfully",
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
  async function updateSession(id: string, session: Partial<Session>) {
    setLoading(true);
    try {
      const response = await window.api.mainUpdateSession([id, session]);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setSessions((prev) =>
        prev.map((session) => (session.id === id ? data : session))
      );
      Toast({
        message: "Session updated successfully",
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
      await listAllSessions();
    })();
  }, []);
  return (
    <SessionContext.Provider
      value={{
        sessions,
        loading,
        error,
        listAllSessions,
        createSession,
        deleteSession,
        updateSession,
      }}>
      {children}
    </SessionContext.Provider>
  );
}
