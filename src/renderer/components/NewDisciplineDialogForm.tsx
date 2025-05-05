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
import { NewDisciplineSchema, NewDisciplineSchemaType } from "@/shared/schemas";
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
import { NotebookPen } from "lucide-react";
import { MDiscipline } from "@/db/sqlite/main/schema";

export default function NewDisciplineDialogForm({
  discipline,
  purpose = "create",
}: Readonly<{
  purpose?: "create" | "edit";
  discipline?: MDiscipline;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const { createDiscipline, listAllDisciplines, updateDiscipline } =
    useDiscipline();
  const defaultValues: NewDisciplineSchemaType = {
    name: discipline?.name || "",
    type: discipline?.type || "performance",
  };
  const form = useForm({
    defaultValues,
    resolver: zodResolver(NewDisciplineSchema),
  });
  async function onSubmit(data: NewDisciplineSchemaType) {
    const validated = NewDisciplineSchema.safeParse(data);
    try {
      if (validated.error) {
        throw new Error(validated.error.message);
      }
      if (purpose === "edit") {
        return onEditSubmit(data);
      }
      const res = await createDiscipline({
        name: validated.data.name,
        type: validated.data.type,
      });
      if (res) {
        await listAllDisciplines();
        form.reset();
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
      Toast({ message: error.message, variation: "error" });
    }
  }
  async function onEditSubmit(data: Partial<MDiscipline>) {
    const validated = NewDisciplineSchema.safeParse(data);
    try {
      if (validated.error) {
        throw new Error(validated.error.message);
      }
      const res = await updateDiscipline(discipline?.id, {
        name: validated.data.name,
        type: validated.data.type,
      });
      if (res) {
        await listAllDisciplines();
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
          variant='secondary'
          size={purpose === "edit" ? "icon" : "default"}
          className={`${purpose === "edit" ? "w-6 h-6" : ""}`}>
          {purpose === "create" ? (
            <span>New Discipline</span>
          ) : (
            <NotebookPen className='mr-2 h-4 w-4' />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {purpose === "create" ? "Create New " : "Edit "}Discipline
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='name'
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
                        {["performance", "team"].map((type) => (
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
