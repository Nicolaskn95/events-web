"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { getEventById, updateEvent } from "@/lib/api";
import { Event, EventFormData } from "@/lib/types";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventById(params.id);

        setEvent(data);
      } catch (err) {
        setError("Failed to load event.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvent();
  }, [params.id]);

  async function handleSubmit(data: EventFormData) {
    try {
      await updateEvent(params.id, data);
      router.push("/");
    } catch (err) {
      setError("Failed to update event. Please try again.");
      console.error(err);
    }
  }

  if (isLoading) {
    return <div>CARREGANDO...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return <div>Evento não encontrado</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Editar Evento</h1>
      <div className="max-w-2xl">
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/")}
        />
      </div>
    </div>
  );
}
