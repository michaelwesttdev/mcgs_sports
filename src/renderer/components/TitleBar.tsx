"use client";
import { useAppFunctions } from "~/hooks/use_appfuncs";
import { useState } from "react";
import DynamicIcon from "./icons/Icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { usePrinters } from "../hooks/use_printers";

interface WindowsTitleBarProps {
  title?: string;
  toggleNav: () => void;
}

export function TitleBar({
  title = "Window Title",
  toggleNav,
}: Readonly<WindowsTitleBarProps>) {
  const { onClose, onMaximize, onMinimize, onRestore } = useAppFunctions();
  const [isMaximized, setIsMaximized] = useState(false);
  const {printers,selectedPrinter,setSelectedPrinter} = usePrinters()

  const handleMaximize = () => {
    isMaximized ? onRestore() : onMaximize();
    setIsMaximized(!isMaximized);
  };

  return (
    <div className='flex flex-col w-full'>
      {/* Title bar with controls */}
      <div className='flex h-8 w-full items-center justify-between bg-gray-900 text-white select-none'>
        <div className='flex items-center px-2 gap-2 flex-grow'>
          <button
            onClick={toggleNav}
            className='flex h-full rounded-md w-12 items-center justify-center transition-colors hover:bg-[#333333] focus:border-none focus:outline-none'
            aria-label='Menu'>
            <DynamicIcon color='#ffffff' size={30} name='menu' />
          </button>
          <span className='text-sm font-medium titlebar'>{title}</span>
          <div className="flex flex-1 items-center justify-center">
            <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:border-none border-none focus:outline-none outline-none">
              <Button className="p-0 hover:bg-transparent focus:border-none border-none focus:outline-none outline-none hover:text-muted-foreground transition-all duration-200" variant="ghost">
                <span>{selectedPrinter?.displayName??"No Printer Selected"}</span>
                <ChevronDown/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {
                  printers.map(p=>(
                    <DropdownMenuItem onClick={()=>{
                      setSelectedPrinter(p);
                    }}>{p.displayName}</DropdownMenuItem>
                  ))
                }
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
        <div className='flex h-full'>
          <button
            onClick={onMinimize}
            className='flex h-full w-12 items-center justify-center transition-colors hover:bg-[#333333]'
            aria-label='Minimize'>
            <DynamicIcon color='#ffffff' size={15} name='minus' />
          </button>
          <button
            onClick={handleMaximize}
            className='flex h-full w-12 items-center justify-center transition-colors hover:bg-[#333333]'
            aria-label={isMaximized ? "Restore Down" : "Maximize"}>
            {isMaximized ? (
              <DynamicIcon color='#ffffff' size={15} name='minimize' />
            ) : (
              <DynamicIcon color='#ffffff' size={15} name='maximize' />
            )}
          </button>
          <button
            onClick={onClose}
            className='flex h-full w-12 items-center justify-center transition-colors hover:bg-[#E81123]'
            aria-label='Close'>
            <DynamicIcon color='#ffffff' size={20} name='close' />
          </button>
        </div>
      </div>
    </div>
  );
}
