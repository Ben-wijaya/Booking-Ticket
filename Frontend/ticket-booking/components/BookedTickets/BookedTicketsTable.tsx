"use client";

import { BookedTicketResponse } from "./types";

interface BookedTicketsTableProps {
  tickets: BookedTicketResponse[];
}

export default function BookedTicketsTable({
  tickets,
}: BookedTicketsTableProps) {
  return (
    <div className="max-w-4xl mx-auto mt-8 mb-4">
      {tickets.map((category) => (
        <div key={category.categoryName} className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-black">
            {category.categoryName} (Total: {category.qtyPerCategory})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-black">
                    Ticket Code
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-black">
                    Ticket Name
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-black">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-black">
                    Booking Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {category.tickets.map((ticket) => (
                  <tr
                    key={ticket.ticketCode}
                    className="border-b hover:bg-gray-100 text-black"
                  >
                    <td className="px-6 py-4">{ticket.ticketCode}</td>
                    <td className="px-6 py-4">{ticket.ticketName}</td>
                    <td className="px-6 py-4">{ticket.quantity}</td>
                    <td className="px-6 py-4">
                      {new Date(ticket.bookingDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
