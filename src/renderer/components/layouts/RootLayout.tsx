import { Outlet } from "react-router";
import { TitleBar } from "../TitleBar";
import { useState } from "react";
import MainNav from "../MainNav";
import { ScrollArea } from "../ui/scroll-area";
export default function RootLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  return (
    <main className='flex flex-col h-screen w-screen overflow-hidden'>
      <TitleBar
        title='MCGS Sports'
        toggleNav={() => setCollapsed(!collapsed)}
      />
      <section className='flex flex-1 overflow-hidden'>
        <MainNav collapsed={collapsed} />
        <ScrollArea className='flex-1'>
          <div className='p-4'>
            <Outlet />
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
