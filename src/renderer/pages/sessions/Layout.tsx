import React from "react";
import { Outlet } from "react-router";
import HouseContextProvider from "~/contexts/house.context.provider";

export default function SessionsLayout() {
  return(
    <HouseContextProvider>
      {<Outlet />}
    </HouseContextProvider>
  )
}
