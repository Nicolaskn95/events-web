import { Event, EventFormData } from "./types";
import Cookies from "js-cookie";
import { config } from "./config";

export interface ApiResponse {
  success: boolean;
  data: Event[];
  count: number;
}
// Função para obter os headers com o token de autenticação
const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "access-token": token } : {}),
  };
};

export async function getAllEvents(): Promise<Event[]> {
  const response = await fetch(`${config.apiUrl}/api/events`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getEventById(id: string): Promise<Event> {
  const response = await fetch(`${config.apiUrl}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createEvent(event: EventFormData): Promise<Event> {
  const response = await fetch(config.apiUrl, {
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
  const response = await fetch(`${config.apiUrl}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(event),
  });
  return response.json();
}

export async function deleteEvent(id: string): Promise<void> {
  console.log(id);
  await fetch(`${config.apiUrl}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export async function searchEvents(query: string): Promise<ApiResponse> {
  const response = await fetch(
    `${config.apiUrl}/search?q=${encodeURIComponent(query)}`,
    {
      headers: getAuthHeaders(),
    }
  );
  console.log(response);
  return response.json();
}
