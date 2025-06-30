import React from "react";
import { Outlet } from "react-router";
import HouseContextProvider from "~/contexts/house.context.provider";

type Props = {};

export default function SessionsLayout({ }: Props) {
  return <>
      <HouseContextProvider>
        {<Outlet />}
      </HouseContextProvider>
  </>;
}
