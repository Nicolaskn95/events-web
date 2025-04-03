import { Suspense } from "react";
import { EventsList } from "@/components/events-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Events</h1>
        <Link href="/events/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading events...</div>}>
        <EventsList />
      </Suspense>
    </div>
  );
}