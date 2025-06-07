"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { createEvent } from "@/lib/api";
import { EventFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function NewEventPage() {
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(data: any) {
    try {
      await createEvent(data);

      router.push("/");
    } catch (err: any) {
      console.error(err);

      // Tratar erros de validação do backend
      if (err.errors && Array.isArray(err.errors)) {
        // Retornar os erros para o EventForm lidar com eles
        return Promise.reject(err);
      } else {
        // Toast para outros tipos de erro
        toast({
          title: "Erro",
          description:
            err.message || "Falha ao criar evento. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        Criar Novo Evento
      </h1>
      <div className="max-w-2xl">
        <EventForm onSubmit={handleSubmit} onCancel={() => router.push("/")} />
      </div>
    </div>
  );
}
