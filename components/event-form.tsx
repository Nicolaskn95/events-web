"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EventFormData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  date: z.date({
    required_error: "A data é obrigatória",
    invalid_type_error: "A data deve estar em formato ISO8601",
  }),
  capacity: z
    .number()
    .int()
    .min(1, "A capacidade deve ser um número inteiro maior ou igual a 1"),
  ticketPrice: z
    .number()
    .min(0, "O preço do ingresso deve ser um número maior ou igual a 0"),
  location: z.string().min(1, "A localização não pode ser nulo"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),
})

interface EventFormProps {
  initialData?: EventFormData
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel: () => void
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const isValidDate = (date: any) => {
    return date && !isNaN(new Date(date).getTime())
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date),
        }
      : {
          title: "",
          date: new Date(),
          capacity: 1,
          ticketPrice: 0,
          location: "",
          description: "",
        },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const result = await onSubmit({
        ...values,
        date: values.date.toISOString().split(".")[0] + "Z",
      })

      // Mostrar toast de sucesso
      toast({
        title: "Success",
        description: initialData
          ? "Evento editado com sucesso!"
          : "Evento criado com sucesso!",
        variant: "default",
        className: "bg-green-700 text-white border-0",
        color: "green",
      })
    } catch (error) {
      // Mostrar toast de erro
      toast({
        title: "Error",
        description:
          "An error occurred while saving the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {isValidDate(field.value) ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Event location" {...field} />
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
                <Textarea
                  placeholder="Event description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Event"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
