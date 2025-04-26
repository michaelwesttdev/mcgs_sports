import React from "react";
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
import { NewSessionSchema, NewSessionSchemaType } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Toast } from "./Toast";
import { Button } from "./ui/button";
import SeachableSelectWithCreationLogic from "./seachableSelectWithCreationLogic";
import { z } from "zod";
import { useDiscipline } from "../hooks/use_discipline";
import { useSession } from "../hooks/use_session";

const defaultValues: NewSessionSchemaType = {
  title: "",
  date: "",
  time: "",
  location: "",
  disciplineId: "",
};

export default function NewSessionDialogForm() {
  const [open, setOpen] = React.useState(false);
  const { disciplines } = useDiscipline();
  const { createSession } = useSession();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(NewSessionSchema),
  });
  async function onSubmit(data: NewSessionSchemaType) {
    const validated = NewSessionSchema.safeParse(data);
    try {
      if (validated.error) {
        throw new Error(validated.error.message);
      }
      const d = validated.data;
      const res = await createSession({
        title: d.title,
        date: d.date,
        time: d.time,
        location: d.location,
        disciplineId: d.disciplineId,
      });
      if (res) {
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log(error);
      Toast({ message: error.message, variation: "error" });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='shadow-md shadow-white/50'>New Session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
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
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormDescription>
                    Date session will take place
                  </FormDescription>
                  <FormControl>
                    <Input type='date' {...field} placeholder='Date' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='time'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormDescription>
                    Time session will take place if known
                  </FormDescription>
                  <FormControl>
                    <Input type='time' {...field} placeholder='Time' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} placeholder='location' />
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
                  <FormLabel>Discipline</FormLabel>
                  <FormControl>
                    <SeachableSelectWithCreationLogic
                      canCreate={true}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder='Select Discipline'
                      options={disciplines.map((d) => ({
                        label: d.name,
                        value: d.id,
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Create</Button>
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
