import { Discipline } from "@/shared/types/db";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Toast } from "../components/Toast";

type Props = { children: React.ReactNode };

interface DisciplineContextProps {
  listAllDisciplines: () => void;
  createDiscipline: (
    discipline: Omit<Discipline, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Promise<boolean>;
  deleteDiscipline: (id: string) => Promise<boolean>;
  updateDiscipline: (
    id: string,
    discipline: Partial<Discipline>
  ) => Promise<boolean>;
  disciplines: Discipline[];
  loading: boolean;
  error: Error | null;
}

export const DisciplineContext = React.createContext<DisciplineContextProps>({
  listAllDisciplines: () => {},
  createDiscipline: () => Promise.resolve(false),
  deleteDiscipline: () => Promise.resolve(false),
  updateDiscipline: () => Promise.resolve(false),
  disciplines: [],
  loading: false,
  error: null,
});

export default function DisciplineContextProvider({ children }: Props) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  async function listAllDisciplines() {
    setLoading(true);
    try {
      const response = await window.api.mainListDiscipline(undefined);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setDisciplines(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  async function createDiscipline(
    discipline: Omit<Discipline, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) {
    setLoading(true);
    try {
      const id = nanoid();
      const response = await window.api.mainCreateDiscipline({
        id,
        ...discipline,
      });
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setDisciplines((prev) => [...prev, data]);
      Toast({
        message: "Discipline created successfully",
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
  async function deleteDiscipline(id: string) {
    setLoading(true);
    try {
      const response = await window.api.mainDeleteDiscipline(id);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setDisciplines((prev) =>
        prev.filter((discipline) => discipline.id !== id)
      );
      Toast({
        message: "Discipline deleted successfully",
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
  async function updateDiscipline(id: string, discipline: Partial<Discipline>) {
    setLoading(true);
    try {
      const response = await window.api.mainUpdateDiscipline([id, discipline]);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setDisciplines((prev) =>
        prev.map((discipline) => (discipline.id === id ? data : discipline))
      );
      Toast({
        message: "Discipline updated successfully",
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
      await listAllDisciplines();
    })();
  }, []);
  return (
    <DisciplineContext.Provider
      value={{
        disciplines,
        loading,
        error,
        listAllDisciplines,
        createDiscipline,
        deleteDiscipline,
        updateDiscipline,
      }}>
      {children}
    </DisciplineContext.Provider>
  );
}
