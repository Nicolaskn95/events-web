export interface Event {
  _id: string
  title: string
  date: string
  capacity: number
  ticketPrice: number
  location: string
  description: string
}

export interface EventFormData {
  title: string
  date: string
  capacity: number
  ticketPrice: number
  location: string
  description: string
}
