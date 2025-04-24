import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist";
import { ZodSchema } from "zod";

type Props = {
  canCreate: boolean;
  onCreate: <T>(data: T) => void;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  searchPlaceholder?: string;
};

export default function SeachableSelectWithCreationLogic({
  canCreate,
  onCreate,
  options,
  onChange,
  value,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
}: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
      }}>
      <PopoverTrigger asChild>
        <Input
          value={value}
          placeholder={placeholder}
          onFocus={(e) => {
            e.preventDefault();
          }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}>
                {option.label}
              </CommandItem>
            ))}
            {canCreate && (
              <CommandItem
                onSelect={() => {
                  onCreate(value);
                  setOpen(false);
                }}>
                Create {value}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type CreateDialogType<T> = {
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void;
  title: string;
  schema: ZodSchema<T>;
};

function CreateDialog<T>({
  defaultValues,
  onSubmit,
  title,
  schema,
}: Readonly<CreateDialogType<T>>) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CommandItem
          onSelect={() => {
            setOpen(true);
          }}>
          Create {title}
        </CommandItem>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {Object.keys(defaultValues).map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{key}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
