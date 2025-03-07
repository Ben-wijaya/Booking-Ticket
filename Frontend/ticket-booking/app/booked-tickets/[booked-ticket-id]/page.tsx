import { getBookedTickets } from "@/utils/api";
import { BookedTicketResponse } from "@/components/BookedTickets/types";

export default async function BookedTicketDetailPage({
  params,
}: {
  params: { bookedTicketId: string };
}) {
  const bookedTicketTransactionId = parseInt(params.bookedTicketId, 10);
  const tickets: BookedTicketResponse[] = await getBookedTickets(
    bookedTicketTransactionId
  );

  if (!tickets || tickets.length === 0) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Booked Ticket Detail
      </h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        {tickets.map((category) => (
          <div key={category.categoryName} className="mb-4">
            <h2 className="text-xl font-bold mb-4">
              {category.categoryName} (Total: {category.qtyPerCategory})
            </h2>
            {category.tickets.map((ticket) => (
              <div key={ticket.ticketCode} className="mb-4">
                <p>
                  <strong>Ticket Code:</strong> {ticket.ticketCode}
                </p>
                <p>
                  <strong>Ticket Name:</strong> {ticket.ticketName}
                </p>
                <p>
                  <strong>Quantity:</strong> {ticket.quantity}
                </p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {new Date(ticket.bookingDate).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
