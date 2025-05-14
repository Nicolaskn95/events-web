import { Event, EventFormData } from "./types";
import Cookies from "js-cookie";

export interface ApiResponse {
  success: boolean;
  data: Event[];
  count: number;
}

const API_URL = "https://events-api-fatec.vercel.app/api/events";
const LOCAL = "http://localhost:3001/api/events";

// Função para obter os headers com o token de autenticação
const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "access-token": token } : {}),
  };
};

export async function getAllEvents(): Promise<Event[]> {
  const response = await fetch(`${LOCAL}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getEventById(id: string): Promise<Event> {
  const response = await fetch(`${LOCAL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createEvent(event: EventFormData): Promise<Event> {
  const response = await fetch(LOCAL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(event),
  });
  console.log(response);
  return response.json();
}

export async function updateEvent(
  id: string,
  event: EventFormData
): Promise<Event> {
  const response = await fetch(`${LOCAL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(event),
  });
  return response.json();
}

export async function deleteEvent(id: string): Promise<void> {
  console.log(id);
  await fetch(`${LOCAL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export async function searchEvents(query: string): Promise<ApiResponse> {
  const response = await fetch(
    `${LOCAL}/search?q=${encodeURIComponent(query)}`,
    {
      headers: getAuthHeaders(),
    }
  );
  console.log(response);
  return response.json();
}
