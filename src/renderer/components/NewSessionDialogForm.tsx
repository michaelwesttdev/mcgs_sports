import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
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

const defaultValues: NewSessionSchemaType = {
  title: "",
  date: "",
  time: "",
  location: "",
  disciplineId: "",
};

export default function NewSessionDialogForm() {
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
      const res = await (window.api as any).mainCreateSession(validated.data);
      if (!res.success) throw new Error(res.error);
      Toast({ message: "Session created successfully", variation: "success" });
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <Input type='text' {...field} placeholder='location' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
