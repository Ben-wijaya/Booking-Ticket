"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revokeTicket } from "@/utils/api";
import { RevokeTicketResponse } from "./types";

export default function RevokeTicketForm() {
  const [bookedTicketId, setBookedTicketId] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [quantity, setQuantity] = useState<number>(1); // Set default quantity to 1
  const [response, setResponse] = useState<RevokeTicketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!bookedTicketId || !ticketCode || quantity <= 0) {
      setError("Please fill in all fields correctly.");
      return;
    }

    try {
      // Kirim data ke backend
      const data = await revokeTicket(
        parseInt(bookedTicketId, 10),
        ticketCode,
        quantity
      );
      setResponse(data);
      setError(null);
    } catch (error) {
      console.error("Error revoking ticket:", error);
      setError(
        error instanceof Error ? error.message : "Failed to revoke ticket"
      );
      setResponse(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Booked Ticket ID
          </label>
          <input
            type="number"
            value={bookedTicketId}
            onChange={(e) => setBookedTicketId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ticket Code
          </label>
          <input
            type="text"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const qty = parseInt(e.target.value);
              setQuantity(isNaN(qty) || qty <= 0 ? 1 : qty); // Set quantity to 1 if invalid
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
        >
          Revoke Ticket
        </button>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {response && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-black">Revoked Ticket</h2>
          <ul>
            <li className="border-b py-2 text-black">
              <p>Ticket Code: {response.ticketCode}</p>
              <p>Ticket Name: {response.ticketName}</p>
              <p>Category: {response.categoryName}</p>
              <p>Remaining Quantity: {response.remainingQuantity}</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
