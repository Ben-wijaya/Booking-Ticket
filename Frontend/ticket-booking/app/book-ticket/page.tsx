import BookTicketForm from "@/components/BookTicket/BookTicketForm";

export default function BookTicketPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Book Ticket
      </h1>
      <BookTicketForm />
    </div>
  );
}
