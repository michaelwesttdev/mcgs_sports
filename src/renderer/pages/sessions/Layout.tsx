import React from "react";
import { Outlet } from "react-router";

type Props = {};

export default function SessionsLayout({}: Props) {
  return <Outlet />;
}
