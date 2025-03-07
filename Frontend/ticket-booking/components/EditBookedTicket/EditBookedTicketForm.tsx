"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editBookedTicket } from "@/utils/api";

type EditBookedTicketFormProps = {
  bookedTicketId: string;
};

export default function EditBookedTicketForm({
  bookedTicketId,
}: EditBookedTicketFormProps) {
  const [tickets, setTickets] = useState<
    { ticketCode: string; quantity: number }[]
  >([{ ticketCode: "", quantity: 0 }]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (
    index: number,
    field: keyof { ticketCode: string; quantity: number },
    value: string | number
  ) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value as never;
    setTickets(newTickets);
  };

  const handleAddTicket = () => {
    setTickets([...tickets, { ticketCode: "", quantity: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pastikan bookedTicketId valid dan bisa dikonversi ke number
    const ticketId = parseInt(bookedTicketId, 10);
    if (isNaN(ticketId)) {
      setError("Invalid Booked Ticket ID");
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {tickets.map((ticket, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ticket Code"
              value={ticket.ticketCode}
              onChange={(e) =>
                handleInputChange(index, "ticketCode", e.target.value)
              }
              className="border p-2 border-black text-black"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ticket.quantity}
              onChange={(e) =>
                handleInputChange(index, "quantity", parseInt(e.target.value))
              }
              className="border p-2 border-black text-black"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTicket}
          className="bg-blue-500 text-white p-2"
        >
          Add Ticket
        </button>
        <button type="submit" className="bg-green-500 text-white p-2">
          Update Tickets
        </button>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}
