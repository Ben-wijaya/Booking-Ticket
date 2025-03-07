"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editBookedTicket } from "@/utils/api";

type TicketResponse = {
  ticketCode: string;
  ticketName: string;
  categoryName: string;
  remainingQuantity: number;
};

export default function EditBookedTicketPage() {
  const [bookedTicketId, setBookedTicketId] = useState<string>("");
  const [ticketCode, setTicketCode] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<TicketResponse[] | null>(null); // State untuk menyimpan response
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!bookedTicketId || !ticketCode || quantity <= 0) {
      setError("Please fill in all fields correctly.");
      return;
    }

    // Konversi bookedTicketId ke number
    const ticketId = parseInt(bookedTicketId, 10);
    if (isNaN(ticketId)) {
      setError("Invalid Booked Ticket ID");
      return;
    }

    try {
      // Panggil API untuk mengupdate tiket
      const response = await editBookedTicket(ticketId, [
        { ticketCode, quantity },
      ]);
      console.log("Response from API:", response); // Debugging
      setResponse(response); // Simpan response ke state
      setError(null); // Reset error
    } catch (error) {
      console.error("Error updating ticket:", error); // Debugging
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update booked ticket"
      );
      setResponse(null); // Reset response jika terjadi error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Edit Booked Ticket
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {/* Input Booked Ticket ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Booked Ticket ID
          </label>
          <input
            type="text"
            value={bookedTicketId}
            onChange={(e) => setBookedTicketId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            placeholder="Enter Booked Ticket ID"
            required
          />
        </div>

        {/* Input Ticket Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ticket Code
          </label>
          <input
            type="text"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            placeholder="Enter Ticket Code"
            required
          />
        </div>

        {/* Input Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            placeholder="Enter Quantity"
            required
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Update Ticket
        </button>
      </form>

      {/* Tampilkan pesan error jika ada */}
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}

      {/* Tampilkan response jika update sukses */}
      {response && (
        <div className="mt-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-black">
            Updated Ticket Details
          </h2>
          <ul className="space-y-2">
            {response.map((ticket, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-lg shadow text-black"
              >
                <p>
                  <strong>Ticket Code:</strong> {ticket.ticketCode}
                </p>
                <p>
                  <strong>Ticket Name:</strong> {ticket.ticketName}
                </p>
                <p>
                  <strong>Category:</strong> {ticket.categoryName}
                </p>
                <p>
                  <strong>Remaining Quantity:</strong>{" "}
                  {ticket.remainingQuantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
