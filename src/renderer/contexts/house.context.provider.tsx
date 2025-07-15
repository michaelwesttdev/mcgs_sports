import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Toast } from "../components/Toast";
import { PSHouse } from "@/db/sqlite/p_sports/schema";

type Props = { children: React.ReactNode };

interface HouseContextProps {
    listAllHouses: () => void;
    createHouse: (
        house: Omit<
            PSHouse,
            "id" | "createdAt" | "updatedAt" | "deletedAt"
        >
    ) => Promise<boolean>;
    deleteHouse: (id: string) => Promise<boolean>;
    updateHouse: (
        id: string,
        house: Partial<PSHouse>
    ) => Promise<boolean>;
    houses: PSHouse[];
    loading: boolean;
    error: Error | null;
}

export const HouseContext = React.createContext<HouseContextProps>({
    listAllHouses: () => Promise.resolve(),
    createHouse: () => Promise.resolve(false),
    deleteHouse: () => Promise.resolve(false),
    updateHouse: () => Promise.resolve(false),
    houses: [],
    loading: false,
    error: null,
});

export default function HouseContextProvider({ children }: Props) {
    const [houses, setHouses] = useState<PSHouse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    async function listAllHouses() {
        setLoading(true);
        try {
            const response = await window.api.psListHouse(undefined);
            if (!response.success) throw new Error(response.error);
            const data = response.data;
            setHouses(data);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }
    async function createHouse(
        house: Omit<
            PSHouse,
            "id" | "createdAt" | "updatedAt" | "deletedAt"
        >
    ) {
        setLoading(true);
        try {
            const id = nanoid();
            const response = await window.api.psCreateHouse({
                id,
                ...house,
            });
            if (!response.success) throw new Error(response.error);
            const data = await response.data;
            setHouses((prev) => [...prev, data]);
            Toast({
                message: "House created successfully",
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
    async function deleteHouse(id: string) {
        setLoading(true);
        try {
            const response = await window.api.mainDeleteDiscipline(id);
            if (!response.success) throw new Error(response.error);
            const data = await response.data;
            setHouses((prev) =>
                prev.filter((house) => house.id !== id)
            );
            Toast({
                message: "House deleted successfully",
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
    async function updateHouse(
        id: string,
        house: Partial<PSHouse>
    ) {
        setLoading(true);
        try {
            const response = await window.api.psUpdateHouse([id, house]);
            if (!response.success) throw new Error(response.error);
            const data = await response.data;
            setHouses((prev) =>
                prev.map((house) => (house.id === id ? data : house))
            );
            Toast({
                message: "house updated successfully",
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
            await listAllHouses();
        })();
    }, []);
    return (
        <HouseContext.Provider
            value={{
                houses,
                loading,
                error,
                listAllHouses,
                createHouse,
                deleteHouse,
                updateHouse,
            }}>
            {children}
        </HouseContext.Provider>
    );
}
