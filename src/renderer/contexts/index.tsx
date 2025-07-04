import React from "react";
import DisciplineContextProvider from "./discipline.context.provider";
import EventContextProvider from "./event.context.provider";
import SessionContextProvider from "./session.context.provider";
import SettingsContextProvider from "~/contexts/settings.context.provider";
import PrintersContextProvider from "./printer.context.provider";
import PrinterSelectionProvider from "../providers/PrinterSelectionProvider";

type Props = {
  children: React.ReactNode;
};

export default function GlobalContextProvider({ children }: Props) {
  return (
    <PrintersContextProvider>
      <SettingsContextProvider>
        <DisciplineContextProvider>
            <EventContextProvider>
                <SessionContextProvider>
                    <PrinterSelectionProvider>
                      {children}
                    </PrinterSelectionProvider>
                </SessionContextProvider>
            </EventContextProvider>
        </DisciplineContextProvider>
    </SettingsContextProvider>
    </PrintersContextProvider>
  );
}
