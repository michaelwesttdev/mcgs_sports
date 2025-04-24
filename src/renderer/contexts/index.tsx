import React from "react";
import DisciplineContextProvider from "./discipline.context.provider";

type Props = {
  children: React.ReactNode;
};

export default function GlobalContextProvider({ children }: Props) {
  return <DisciplineContextProvider>{children}</DisciplineContextProvider>;
}
