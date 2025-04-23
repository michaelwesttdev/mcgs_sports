import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

export default function Loader({}: Props) {
  return (
    <div className='flex items-center justify-center p-8 transition-all duration-300 flex-col'>
      <Loader2 className='animate-spin' />
      <p className='text-xl font-semibold tracking-wider mt-3'>Loading...</p>
    </div>
  );
}
