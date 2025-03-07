"use client";

import { useState } from "react";
import { bookTicket } from "@/utils/api";
import BookTicketSummary from "./BookTicketSummary";
import { BookTicketResponse, TicketBookingDetail } from "./types";

const formatDate = (date: string) => {
  const dt = new Date(date);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(dt.getDate()).padStart(2, "0")} ${String(dt.getHours()).padStart(
    2,
    "0"
  )}:${String(dt.getMinutes()).padStart(2, "0")}:${String(
    dt.getSeconds()
  ).padStart(2, "0")}.${String(dt.getMilliseconds()).padStart(3, "0")}`;
};

export default function BookTicketForm() {
  const [tickets, setTickets] = useState<TicketBookingDetail[]>([
    { ticketCode: "", quantity: 1, bookingDate: "" }, // Default quantity = 1
  ]);
  const [response, setResponse] = useState<BookTicketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    index: number,
    field: keyof TicketBookingDetail,
    value: string | number
  ) => {
    const newTickets = [...tickets];

    if (field === "quantity") {
      const quantity = Number(value);
      newTickets[index][field] =
        isNaN(quantity) || quantity <= 0 ? 1 : (quantity as never);
    } else if (field === "bookingDate") {
      const date = new Date(value as string);
      if (!isNaN(date.getTime())) {
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${date
          .getSeconds()
          .toString()
          .padStart(2, "0")}.${date
          .getMilliseconds()
          .toString()
          .padStart(3, "0")}`;

        newTickets[index][field] = formattedDate as never;
      }
    } else {
      newTickets[index][field] = value as never;
    }

    setTickets(newTickets);
  };

  const handleAddTicket = () => {
    setTickets([...tickets, { ticketCode: "", quantity: 1, bookingDate: "" }]); // Default quantity 1 saat menambahkan tiket
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await bookTicket({ tickets });
      setResponse(data);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to book ticket"
      );
      setResponse(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {tickets.map((ticket, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Ticket Code"
              value={ticket.ticketCode}
              onChange={(e) =>
                handleInputChange(index, "ticketCode", e.target.value)
              }
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 text-black"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ticket.quantity}
              onChange={(e) =>
                handleInputChange(index, "quantity", parseInt(e.target.value))
              }
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 text-black"
              min={1}
            />
            <input
              type="datetime-local"
              value={ticket.bookingDate}
              onChange={(e) =>
                handleInputChange(index, "bookingDate", e.target.value)
              }
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 text-black"
            />
          </div>
        ))}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleAddTicket}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Ticket
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Book Tickets
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {response && <BookTicketSummary response={response} />}
    </div>
  );
}
