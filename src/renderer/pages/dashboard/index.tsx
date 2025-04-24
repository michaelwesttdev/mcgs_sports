import NewSessionDialogForm from "@/renderer/components/NewSessionDialogForm";
import { Button } from "@/renderer/components/ui/button";
import { Card, CardContent } from "@/renderer/components/ui/card";
import { format } from "date-fns";
import React from "react";

function DashboardPageHeader() {
  return (
    <div className='bg-gradient-to-r from-[#ff0000] to-[#00007e] rounded-md p-4 text-white w-full'>
      <div className='flex items-center gap-2 justify-between'>
        <h1 className='text-xl font-bold'>MCGS Sports Scoring DashBoard</h1>
        <p className='text-xs tracking-wide'>{format(new Date(), "PPPP")}</p>
      </div>
      <div className='container flex items-center justify-end pt-4'>
        <NewSessionDialogForm />
      </div>
    </div>
  );
}
function DashboardPageQuickActions() {
  return (
    <Card className='my-4'>
      <CardContent className='flex items-center gap-5 p-4'>
        <Card className='max-w-[250px] w-max p-2 cursor-pointer select-none hover:scale-105 transition-all duration-200'>
          <CardContent>
            <h1 className='text-3xl font-bold'>20</h1>
            <p>Total Sessions</p>
          </CardContent>
        </Card>
        <Card className='max-w-[250px] w-max p-2 cursor-pointer select-none hover:scale-105 transition-all duration-200'>
          <CardContent>
            <h1 className='text-3xl font-bold'>20</h1>
            <p>Total Events</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className='p-6 pt-2'>
      <DashboardPageHeader />
      <DashboardPageQuickActions />
    </div>
  );
}
