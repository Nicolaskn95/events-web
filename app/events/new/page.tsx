"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { createEvent } from "@/lib/api";
import { EventFormData } from "@/lib/types";

export default function NewEventPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(data: EventFormData) {
    try {
      await createEvent(data);
      router.push("/");
    } catch (err) {
      setError("Failed to create event. Please try again.");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Create New Event</h1>
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      <div className="max-w-2xl">
        <EventForm onSubmit={handleSubmit} onCancel={() => router.push("/")} />
      </div>
    </div>
  );
}