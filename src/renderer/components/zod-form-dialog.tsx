
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodTypeAny, z } from "zod";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "~/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Textarea} from "~/components/ui/textarea";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";

export type FieldOverride = {
    component?: "textarea" | "input"|"color"|"number";
    placeholder?: string;
    label?: string;
    type?: React.HTMLInputTypeAttribute;
};

interface ZodFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    schema: ZodTypeAny;
    onSubmit: (data: any) => Promise<void> | void;
    overrides?: Record<string, FieldOverride>;
}

export const ZodFormDialog = ({
                                  open,
                                  onOpenChange,
                                  title,
                                  description,
                                  schema,
                                  onSubmit,
                                  overrides = {},
                              }: ZodFormDialogProps) => {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {},
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fields = schema instanceof z.ZodObject
        ? Object.entries(schema.shape)
        : [];

    const handleSubmit = async (values: any) => {
        try {
            setIsSubmitting(true);
            await onSubmit(values);
            form.reset();
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {fields.map(([name, fieldSchema]) => {
                            const override = overrides[name] || {};
                            const isTextarea = override.component === "textarea";
                            const label = override.label ?? name;
                            const placeholder = override.placeholder ?? `Enter ${label}`;

                            return (
                                <FormField control={form.control} render={({field})=>(
                                    <FormItem>
                                        <FormLabel>{label}</FormLabel>
                                        <FormControl>
                                            {isTextarea ? (
                                                <Textarea placeholder={placeholder} {...field} />
                                            ) : (
                                                <Input type={override.type?? "text"} placeholder={placeholder} {...field} />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} name={name}/>
                            );
                        })}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="button" onClick={()=>{
                                form.handleSubmit(handleSubmit)();
                            }} disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
