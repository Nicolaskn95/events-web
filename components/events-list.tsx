"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Event } from "@/lib/types"
import { getAllEvents, deleteEvent, searchEvents } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  DollarSign,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface EventsListProps {
  searchTerm?: string
  startDate?: string
  endDate?: string
  minPrice?: string
  maxPrice?: string
}

export function EventsList({
  searchTerm,
  startDate,
  endDate,
  minPrice,
  maxPrice,
}: EventsListProps) {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [searchTerm, startDate, endDate, minPrice, maxPrice])

  async function loadEvents() {
    try {
      setIsLoading(true)
      setError(null)

      // Verifica se há algum filtro ativo
      const hasFilters =
        searchTerm || startDate || endDate || minPrice || maxPrice

      if (hasFilters) {
        // Se houver filtros, usa a busca com parâmetros
        const params = new URLSearchParams()
        searchTerm === undefined
          ? params.append("q", "undefined")
          : params.append("q", searchTerm)
        if (startDate) params.append("startDate", startDate)
        if (endDate) params.append("endDate", endDate)
        if (minPrice) params.append("minPrice", minPrice)
        if (maxPrice) params.append("maxPrice", maxPrice)

        const { data } = await searchEvents(params.toString())
        setEvents(Array.isArray(data) ? data : [])
      } else {
        // Se não houver filtros, busca todos os eventos
        const data = await getAllEvents()
        setEvents(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Falha ao carregar eventos:", error)
      setError("Falha ao carregar eventos. Por favor, tente novamente.")
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEvent(id)
      await loadEvents()
      toast({
        title: "Success",
        description: "Evento deletado com sucesso!",
        className: "bg-red-700 text-white border-0",
        color: "red",
      })
    } catch (error) {
      console.error("Failed to delete event:", error)
      toast({
        title: "Error",
        description: "Falha ao deletar o evento. Tente novamente.",
        className: "bg-red-500 text-white border-0",
        color: "red",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={loadEvents}>
          Tente Novamente
        </Button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">
          No events found matching your criteria
        </p>
        {searchTerm || startDate || endDate || minPrice || maxPrice || (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event._id}
          className="hover:shadow-lg transition-shadow h-full flex flex-col"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold line-clamp-2">
                {event.title}
              </CardTitle>
              <div className="flex space-x-1">
                <Link href={`/events/${event._id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar Evento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza de que deseja excluir este evento? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(event._id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-3">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{format(new Date(event.date), "PPPp")}</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>
                  {event.ticketPrice === 0
                    ? "Free"
                    : `$${event.ticketPrice.toFixed(2)}`}
                </span>
              </div>
            </div>

            {new Date(event.date) > new Date() && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {Math.ceil(
                    (new Date(event.date).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  Dias faltantes
                </span>
              </div>
            )}

            <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
              {event.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
