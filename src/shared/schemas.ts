import { z } from "zod";

export const NewSessionSchema = z.object({
  title: z.string().min(1, "Session name is required"),
  date: z.string({ message: "Date is required" }),
  time: z.string().refine((value) => {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  }, "Invalid time format. Please use HH:MM format."),
  location: z.string().min(1, "Location is required"),
  disciplineId: z.string().min(1, "Descipline is required"),
});
export const NewMainEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  disciplineId: z.string().min(1, "Descipline is required"),
  type: z.enum(["team", "individual"], {
    message: "Event type is required",
  }),
});
/*
title: string;
  description: string;
  disciplineId: string;
  type: "team" | "individual"; 
 */
export const NewDisciplineSchema = z.object({
  name: z.string().min(1, "Discipline name is required"),
  type: z.enum(["performance", "team"], {
    message: "Discipline type is required",
  }),
});

/* types */
export type NewSessionSchemaType = z.infer<typeof NewSessionSchema>;
export type NewDisciplineSchemaType = z.infer<typeof NewDisciplineSchema>;
export type NewMainEventSchemaType = z.infer<typeof NewMainEventSchema>;
