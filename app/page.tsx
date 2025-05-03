"use client"
import { Suspense, use, useState } from "react"
import { EventsList } from "@/components/events-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
export default function Home() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [activeFilters, setActiveFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    minPrice: "",
    maxPrice: "",
  })

  const handleSearch = () => {
    setActiveFilters({
      searchTerm,
      startDate,
      endDate,
      minPrice,
      maxPrice,
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStartDate("")
    setEndDate("")
    setMinPrice("")
    setMaxPrice("")
    setActiveFilters({
      searchTerm: "",
      startDate: "",
      endDate: "",
      minPrice: "",
      maxPrice: "",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Eventos</h1>
        <Link href="/events/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Evento
          </Button>
        </Link>
      </div>

      {/* Filtros expandidos */}
      <div className="space-y-4 mb-6 p-4 border rounded-lg">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Título</Label>
              <Input
                placeholder="Procure eventos por título"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div>
              <Label>Preço Mínimo</Label>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || Number(value) >= 0) {
                    setMinPrice(value)
                  }
                }}
                className="w-[100px]"
              />
            </div>

            <div>
              <Label>Preço Máximo</Label>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || Number(value) >= 0) {
                    setMaxPrice(value)
                  }
                }}
                className="w-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <div>
              <Label>Data Inicial</Label>

              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[150px]"
              />
            </div>

            <div>
              <Label>Data Final</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[150px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={resetFilters}>
            Limpar
          </Button>
          <Button onClick={handleSearch}>Aplicar Filtros</Button>
        </div>
      </div>

      <Suspense fallback={<div>Carregando eventos...</div>}>
        <EventsList {...activeFilters} />
      </Suspense>
    </div>
  )
}
