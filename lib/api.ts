import { Event, EventFormData } from "./types"
export interface ApiResponse {
  success: boolean
  data: Event[]
  count: number
}

const API_URL = "https://events-api-fatec.vercel.app/api/events"
const LOCAL = "http://localhost:3001/api/events"

export async function getAllEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}`)
  return response.json()
}

export async function getEventById(id: string): Promise<Event> {
  const response = await fetch(`${API_URL}/${id}`)
  return response.json()
}

export async function createEvent(event: EventFormData): Promise<Event> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
  console.log(response)
  return response.json()
}

export async function updateEvent(
  id: string,
  event: EventFormData
): Promise<Event> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
  return response.json()
}

export async function deleteEvent(id: string): Promise<void> {
  console.log(id)
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
}

export async function searchEvents(query: string): Promise<ApiResponse> {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}`
  )
  console.log(response)
  return response.json()
}
