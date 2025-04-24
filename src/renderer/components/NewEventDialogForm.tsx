import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import {
  NewDisciplineSchema,
  NewDisciplineSchemaType,
  NewMainEventSchema,
  NewMainEventSchemaType,
} from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Toast } from "./Toast";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDiscipline } from "../hooks/use_discipline";
import { Discipline, MainEvent } from "@/shared/types/db";
import { NotebookPen } from "lucide-react";
import { useEvents } from "../hooks/use_events";
import { Textarea } from "./ui/textarea";

export default function NewEventDialogForm({
  event,
  purpose = "create",
}: Readonly<{
  purpose?: "create" | "edit";
  event?: MainEvent;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const { createEvent, listAllEvents, updateEvent } = useEvents();
  const { disciplines } = useDiscipline();
  const defaultValues: NewMainEventSchemaType = {
    title: event?.title || "",
    type: event?.type || "individual",
    disciplineId: event?.disciplineId || "",
    description: event?.description || "",
  };
  const form = useForm({
    defaultValues,
    resolver: zodResolver(NewMainEventSchema),
  });
  async function onSubmit(data: NewMainEventSchemaType) {
    const validated = NewMainEventSchema.safeParse(data);
    try {
      if (validated.error) {
        throw new Error(validated.error.message);
      }
      if (purpose === "edit") {
        return onEditSubmit(data);
      }
      const res = await createEvent({
        title: validated.data.title,
        type: validated.data.type,
        disciplineId: validated.data.disciplineId,
        description: validated.data.description,
      });
      if (res) {
        await listAllEvents();
        form.reset();
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
      Toast({ message: error.message, variation: "error" });
    }
  }
  async function onEditSubmit(data: Partial<MainEvent>) {
    const validated = NewMainEventSchema.safeParse(data);
    try {
      if (validated.error) {
        throw new Error(validated.error.message);
      }
      const res = await updateEvent(event?.id, {
        title: validated.data.title,
        type: validated.data.type,
        disciplineId: validated.data.disciplineId,
        description: validated.data.description,
      });
      if (res) {
        await listAllEvents();
        form.reset();
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
      Toast({ message: error.message, variation: "error" });
    }
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          form.reset();
        }
        setIsOpen(v);
      }}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size={purpose === "edit" ? "icon" : "default"}
          className={`${purpose === "edit" ? "w-6 h-6" : ""}`}>
          {purpose === "create" ? (
            <span>New Event</span>
          ) : (
            <NotebookPen className='mr-2 h-4 w-4' />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {purpose === "create" ? "Create New " : "Edit "}Event
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Description'
                      rows={4}
                      className=' resize-none'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormDescription>Type session belongs to</FormDescription>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a type' />
                      </SelectTrigger>
                      <SelectContent>
                        {["individual", "team"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='disciplineId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discipline ID</FormLabel>
                  <FormDescription>
                    Discipline this event belongs to
                  </FormDescription>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a discipline' />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplines
                          .filter((d) => d.type === "performance")
                          .map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='capitalize'>
              {purpose}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/*
<SeachableSelectWithCreationLogic
                      canCreate={true}
                      onCreate={(v) => {}}
                      options={[
                        {
                          label: "Basketball",
                          value: "basketball",
                        },
                        {
                          label: "Football",
                          value: "football",
                        },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      createSchema={z.object({
                        name: z.string({
                          message: "Discipline Name is required",
                        }),
                      })}
                      createFormDefaults={{ name: "" }}
                      renderCreateFields={(form) => (
                        <FormField
                          control={form.control}
                          name='name'
                          render={ ({ field }) => (
                            <FormItem>
                              <FormLabel>Discipline Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder='Discipline Name' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>)}
                    /> 
 */
