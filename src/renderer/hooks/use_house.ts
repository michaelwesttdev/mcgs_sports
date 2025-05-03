import {useContext} from "react";
import {HouseContext} from "~/contexts/house.context.provider";

export function useHouse() {
    const context = useContext(HouseContext);
    if (!context) {
        throw new Error("useHouse must be used within a HouseProvider");
    }
    return context;
}