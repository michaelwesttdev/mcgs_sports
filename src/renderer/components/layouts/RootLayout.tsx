import { Outlet } from "react-router";
import { TitleBar } from "../TitleBar";
import { useState } from "react";
export default function RootLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  return (
    <main className=''>
      <TitleBar
        title='MCGS Sports'
        toggleNav={() => setCollapsed(!collapsed)}
      />
      <Outlet />
    </main>
  );
}
