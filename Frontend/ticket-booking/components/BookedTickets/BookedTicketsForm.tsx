"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBookedTickets } from "@/utils/api";
import BookedTicketsTable from "./BookedTicketsTable";
import { BookedTicketResponse } from "./types";

export default function BookedTicketsForm() {
  const [tickets, setTickets] = useState<BookedTicketResponse[]>([]);
  const [bookedTicketTransactionId, setBookedTicketTransactionId] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFetchTickets = async () => {
    if (!bookedTicketTransactionId) {
      setError("Please enter a valid transaction ID.");
      return;
    }

    try {
      setError(null); // Reset error state
      const data = await getBookedTickets(bookedTicketTransactionId);
      setTickets(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Tampilkan pesan error dari backend
      } else {
        setError("An unexpected error occurred");
      }
      setTickets([]); // Reset data tiket
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-md shadow-md">
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction ID
          </label>
          <input
            type="number"
            value={bookedTicketTransactionId || ""}
            onChange={(e) =>
              setBookedTicketTransactionId(Number(e.target.value))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-md text-black p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleFetchTickets}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Fetch Tickets
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {tickets.length > 0 && <BookedTicketsTable tickets={tickets} />}
    </div>
  );
}
