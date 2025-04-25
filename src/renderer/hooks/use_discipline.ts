import { useContext, useEffect } from "react";
import { DisciplineContext } from "../contexts/discipline.context.provider";

export function useDiscipline() {
  const context = useContext(DisciplineContext);
  if (!context) {
    throw new Error(
      "useDisciplineContext must be used within a DisciplineProvider"
    );
  }
  return context;
}
                      