import {useEffect, useState} from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {z, ZodSchema} from "zod"
import {PlusCircle, Trash2, Grid2X2Check, UserRoundX} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {nanoid} from "nanoid";
import {Toast} from "~/components/Toast";
import {cn} from "~/lib/utils";
import SeachableSelectWithCreationLogic from "~/components/seachableSelectWithCreationLogic";
import {ScrollArea} from "~/components/ui/scroll-area";
import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import {getAge} from "@/shared/helpers/dates";
import {useSettings} from "~/hooks/use_settings";
import {
  assignPointsPreservingOrder,
  checkIfRecordHasBeenBroken
} from "@/shared/helpers/ps_helpers";
import {Settings} from "@/shared/settings";

const createEventResultSchema = (settings: Settings, event: PSEvent) => {
  const regexPattern = settings?.metrics[event.measurementMetric];
  const regex = regexPattern ? new RegExp(regexPattern) : /.*/; // fallback to match everything

  return z.object({
    bestScore: z
        .string()
        .min(1, "Best score is required")
        .refine(val => regex.test(val), {
          message: `Best score must match pattern for ${event.measurementMetric} e.g 1.1 or 10.56`,
        }),
    results: z.array(
        z.object({
          id: z.string(),
          participantId: z.string().min(1, "Participant is required"),
          position: z.coerce.number().int().min(0, "Position must be 0 (disqualified) or a positive number"),
        }),
    ),
  });
};

interface EventResultsDialogProps {
  eventId: string
  eventTitle: string
  event:PSEvent,
  participants:PSParticipant[],
  houses:PSHouse[],
  results:PSEventResult[],
  canOpen?:boolean,
  createResult: (result: Omit<PSEventResult,"createdAt"|"updatedAt"|"deletedAt">) => Promise<void>,
  updateResult: (resultId:string,result: Partial<PSEventResult>)=>Promise<void>,
  deleteResult: (resultId:string) => Promise<void>,
  updateEvent:(eventId:string,data:Partial<PSEvent>)=>Promise<void>,
  toggleButton?:React.ReactElement,
}

export default function PsEventResultsDialog({deleteResult,updateEvent,canOpen=true,toggleButton, results,createResult,updateResult,eventId,participants,houses, eventTitle, event }: EventResultsDialogProps) {
  const [open, setOpen] = useState(false)
  const {settings} = useSettings();
  const [schema,setSchema] = useState<ZodSchema>();
  type EventResultFormValues = z.infer<typeof schema>

  // Initialize form with default values
  const form = useForm<EventResultFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bestScore:"",
      results: [
        {
          id: nanoid(),
          participantId: "",
          position: 1,
        },
      ],
    },
  })

  // Setup field array for dynamic results
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "results",
  })

  // Add a new result entry
  const addResult = () => {
    append({
      id: nanoid(),
      participantId: "",
      position: fields.length + 1,
    })
  }

  // Disqualify a participant
  const disqualifyParticipant = (index: number) => {
    form.setValue(`results.${index}.position`, 0)
  }

  // Submit handler
  const onSubmit = async (data: EventResultFormValues) => {
    try {
      // Add eventId to the submission
      const submission = assignPointsPreservingOrder(data.results.map((r:{id: string,
        participantId: string,
        position: number})=>{
        return {
          id: r.id,
          participantId:r.participantId,
          position: r.position,
        }
      }),event.type,settings,eventId)
      const isSameEntry = (
          a: Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">,
          b: Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">
      ) => a.id === b.id

// Separate existing and new
      const alreadyInDB = submission.filter(sub =>
          results.some(existing => isSameEntry(sub, existing))
      );

      const newEntries = submission.filter(sub =>
          !results.some(existing => isSameEntry(sub, existing))
      );

      if(alreadyInDB.length>0){
        Promise.all(alreadyInDB.map(async (result) => {
          await updateResult(result.id,result)
        })).catch(e=>{
          console.log(e);
          throw e;
        })
      }
      if(newEntries.length>0){
        Promise.all(newEntries.map(async (result) => {
          await createResult(result)
        })).catch(e=>{
          console.log(e);
          throw e;
        })
      }
      const recordStatus = checkIfRecordHasBeenBroken(data.bestScore,[...alreadyInDB,...newEntries],"distance",event,participants,houses)
      const recordData = recordStatus.isBroken?
          {record:recordStatus.newRecord,
           recordHolder:recordStatus.recordHolder,
           isRecordBroken:recordStatus.isBroken
          }:{};
      await updateEvent(event.id,{
        bestScore:data.bestScore,
        status:[...alreadyInDB,...newEntries].length>0?"complete":"pending",
        ...recordData
      })
      Toast({
        variation: "success",
        message: "Event results have been saved successfully.",
      })

      setOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error saving event results:", error)
      Toast({
        variation: "error",
        message: "Failed to save event results. Please try again.",
      })
    }
  }

  useEffect(() => {
    if (open && results.length > 0) {
      form.reset({
        results: results.map(result => ({
          id: result.id,
          participantId: result.participantId,
          position: result.position,
        })),
      });
    }
  }, [open, results]);
  useEffect(() => {
    if (open && event && settings) {
      setSchema(createEventResultSchema(settings,event))
    }
  }, [open, event,settings]);
  return (
    <Dialog open={open} onOpenChange={(v)=>{
      if(!canOpen) {
        setOpen(false)
      }
      if(!v) {
        form.reset()
      }
      setOpen(v)
    }}>
      <DialogTrigger asChild>
        {
          toggleButton || <Button variant="outline" size="icon" className={`w-6 h-6`} >
              <Grid2X2Check className="h-4 w-4"/>
            </Button>
        }

      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] px-0">
        <ScrollArea className={"max-h-[90dvh] px-3"}>
          <DialogHeader>
            <DialogTitle>Enter Results for {eventTitle}</DialogTitle>
            <DialogDescription>
              Add the results for this event. Click the plus button to add more entries.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium underline">Results</h3>
                  <FormField
                      control={form.control}
                      name={`bestScore`}
                      render={({ field }) => (
                          <FormItem className={"flex flex-1 items-center gap-2"}>
                            <FormLabel className={"flex flex-col text-[14px] w-full"}>Best Score
                              <span className={"text-xs text-muted-foreground"}>NB: use only numbers</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                  type="number"

                                  {...field}
                                  placeholder={"e.g, 1.56"}
                                  className={
                                    cn("w-full")
                                  }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="rounded-lg border p-2 space-y-4">
                      <div className="flex items-center gap-4 w-full">
                        {index > 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                        )}
                        <span className={"text-red-600 text-xs tracking-wider"}>{form.watch(`results.${index}.position`) === 0
                            ?"Disqualified":<Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => disqualifyParticipant(index)}
                                className="flex items-center gap-1 w-6 h-6 text-xs"
                            >
                              <UserRoundX className="h-3 w-3"/>
                            </Button>}</span>
                      </div>
                      {/*form fields*/}
                      <div className="flex items-center gap-2 w-full">
                        <FormField
                            control={form.control}
                            name={`results.${index}.position`}
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={"grid text-[14px]"}>Position
                                    <span className={"text-xs text-muted-foreground"}>NB: 0 means DQ</span>
                                  </FormLabel>
                                  <FormControl>
                                  <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        className={
                                          cn("max-w-[60px]",form.watch(`results.${index}.position`) === 0 ? "bg-red-50 dark:bg-red-950/20" : "")
                                        }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`results.${index}.participantId`}
                            render={({ field }) => (
                                <FormItem className={"flex-1"}>
                                  <FormLabel className={"grid text-[14px]"}>{event.type === "individual" ? "Participant" : "House"}
                                    <span className={"text-xs text-muted-foreground"}>Participant for Position</span>
                                  </FormLabel>
                                  <SeachableSelectWithCreationLogic canCreate={false} options={event?.type === "individual"
                                      ? participants
                                          .filter((p) => {
                                            const ageGroup = settings?.ageGroups[event.ageGroup];
                                            const age = getAge(p.dob);

                                            if (typeof ageGroup === "number") {
                                              return p.gender === event?.gender && age >= ageGroup;
                                            }

                                            if (Array.isArray(ageGroup)) {
                                              return p.gender === event?.gender && ageGroup.includes(age);
                                            }

                                            return false;
                                          })
                                          .map((participant) => ({
                                            label: `${participant?.firstName??""} ${participant?.lastName??""}`,
                                            value: participant?.id??"",
                                          }))
                                      : houses.map((house) => (
                                          {
                                            label:`${house.name}`,
                                            value:house.id
                                          }
                                      ))} onChange={field.onChange} value={field.value} placeholder={`Select ${event.type === "individual" ? "participant" : "house"}`}/>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                    </div>
                ))}

              </div>

              <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={addResult}
                    className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Result
                </Button>
                <Button type="submit">Save Results</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
