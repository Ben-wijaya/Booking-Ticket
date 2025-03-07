"use client";

import { BookTicketResponse } from "./types";

interface BookTicketSummaryProps {
  response: BookTicketResponse;
}

export default function BookTicketSummary({
  response,
}: BookTicketSummaryProps) {
  return (
    <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-black">Booking Summary</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-black">Tickets</h3>
          <ul>
            {response.tickets.map((ticket, index) => (
              <li key={index} className="border-b py-2 text-black">
                <p>Ticket Code: {ticket.ticketCode}</p>
                <p>Ticket Name: {ticket.ticketName}</p>
                <p>Category: {ticket.categoryName}</p>
                <p>Price: Rp. {ticket.price.toFixed(2)}</p>
                <p>Quantity: {ticket.quantity}</p>
                <p>
                  Booking Date: {new Date(ticket.bookingDate).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-black">Category Totals</h3>
          <ul>
            {response.categoryTotals.map((category, index) => (
              <li key={index} className="border-b py-2 text-black">
                <p>Category: {category.categoryName}</p>
                <p>Total Price: Rp. {category.totalPrice.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-black">Grand Total</h3>
          <p className="text-black">Rp. {response.grandTotal.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-black">Total Tickets</h3>
          <p className="text-black">{response.totalTickets}</p>
        </div>
      </div>
    </div>
  );
}
