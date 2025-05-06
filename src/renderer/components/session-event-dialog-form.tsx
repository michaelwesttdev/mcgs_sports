import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "~/components/ui/input"
import { Toast } from "~/components/Toast"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { NotebookPen } from "lucide-react"
import { z } from "zod"
import {PSEvent} from "@/db/sqlite/p_sports/schema";
import {ScrollArea} from "~/components/ui/scroll-area";
import {useSettings} from "~/hooks/use_settings";

// Define the schema for the Session Event form
const SessionEventSchema = z.object({
  eventNumber: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  type: z.enum(["team", "individual"]),
  ageGroup: z.number().optional(),
  gender: z.enum(["male", "female", "mixed"]),
  recordHolder: z.string().optional(),
  measurementMetric: z.string().optional(),
  record: z.string().optional(),
  status: z.enum(["pending", "complete"]).optional(),
  isRecordBroken: z.boolean().optional(),
})

type SessionEventSchemaType = z.infer<typeof SessionEventSchema>

export default function SessionEventDialogForm({
  event,
  purpose = "create",
    onCreate,
    onUpdate,
    trigger,
    eventNumber=1
}: Readonly<{
  purpose?: "create" | "edit";
  event?: PSEvent;
    onCreate?: (data: SessionEventSchemaType) => Promise<void>;
    onUpdate?: (id:string,data: Partial<SessionEventSchemaType>) => Promise<void>;
    trigger?:React.ReactElement,
    eventNumber?:number
}>) {
  const [isOpen, setIsOpen] = useState(false)
    const {settings} = useSettings();

  const defaultValues: SessionEventSchemaType = {
    eventNumber: event?.eventNumber || eventNumber,
    title: event?.title || "",
    description: event?.description || "",
    type: event?.type || "individual",
    ageGroup: event?.ageGroup || 0,
    gender: event?.gender || "mixed",
    recordHolder: event?.recordHolder || "",
    measurementMetric: event?.measurementMetric || "",
    record: event?.record || "",
    status: event?.status || "pending",
    isRecordBroken: event?.isRecordBroken || false,
  }

  const form = useForm({
    defaultValues,
    resolver: zodResolver(SessionEventSchema),
  })

  async function onSubmit(data: SessionEventSchemaType) {
    try {
      const validated = SessionEventSchema.safeParse(data);
      if (validated.error) {
          throw new Error(validated.error.message);
      }

      if (purpose === "edit") {
        await onUpdate(event?.id, data);
      } else {
        await onCreate(data);
      }

      form.reset()
      setIsOpen(false)
      Toast({
        message: `Session Event ${purpose === "create" ? "created" : "updated"} successfully`,
        variation: "success",
      })
    } catch (error) {
      console.error(error)
      Toast({ message: error.message, variation: "error" })
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          form.reset()
        }
        setIsOpen(v)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={purpose === "edit" ? "icon" : "default"}
          className={`${purpose === "edit" ? "w-6 h-6" : ""} w-max`}
        >
          {purpose === "create" ? <span>New Session Event</span> : <NotebookPen className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
          <ScrollArea className={"max-h-[90dvh] px-3"}> <DialogHeader>
              <DialogTitle>{purpose === "create" ? "Create New" : "Edit"} Session Event</DialogTitle>
          </DialogHeader>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                          control={form.control}
                          name="eventNumber"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Event Number</FormLabel>
                                  <FormControl>
                                      <Input
                                      min={eventNumber}
                                          type="number"
                                          {...field}
                                          onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : 0)}
                                          placeholder="Event Number"
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                      <Input {...field} placeholder="Event Title" />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                      <Textarea {...field} placeholder="Event Description" />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Type</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select event type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem value="individual">Individual</SelectItem>
                                              <SelectItem value="team">Team</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="ageGroup"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Age Group</FormLabel>
                                  <FormControl>
                                          <Select name={field.name} onValueChange={(value)=>{
                                              console.log(value)
                                              field.onChange(parseInt(value))
                                          }} value={field.value.toString()}>
                                              <SelectTrigger className={"capitalize"}>
                                                  <SelectValue placeholder="Select age group" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                  {
                                                      Object.keys(settings.ageGroups).map((item, index) => {
                                                          const ageGroup = item==="open"?100:parseInt(item.slice(1));
                                                          return (
                                                              <SelectItem className={"capitalize"} value={ageGroup.toString()} key={item}>{item}</SelectItem>
                                                          )
                                                      })
                                                  }
                                              </SelectContent>
                                          </Select>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select gender" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem value="male">Male</SelectItem>
                                              <SelectItem value="female">Female</SelectItem>
                                              <SelectItem value="mixed">Mixed</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="recordHolder"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Record Holder</FormLabel>
                                  <FormControl>
                                      <Input {...field} placeholder="Record Holder Name" />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="measurementMetric"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Measurement Metric</FormLabel>
                                  <FormControl>
                                      <Select name={field.name} onValueChange={field.onChange} value={field.value}>
                                          <SelectTrigger className={"capitalize"}>
                                              <SelectValue placeholder="Select metric" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              {
                                                  Object.keys(settings.metrics).map((item, index) => {
                                                      const  metric:string = settings.metrics[item];
                                                      return (
                                                          <SelectItem className={"capitalize"} value={item} key={item}>{metric}</SelectItem>
                                                      )
                                                  })
                                              }
                                          </SelectContent>
                                      </Select>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="record"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Record</FormLabel>
                                  <FormControl>
                                      <Input {...field} placeholder="Current Record" />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem value="pending">Pending</SelectItem>
                                              <SelectItem value="complete">Complete</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <Button type="submit" className="capitalize">
                          {purpose}
                      </Button>
                  </form>
              </Form></ScrollArea>

      </DialogContent>
    </Dialog>
  )
}
