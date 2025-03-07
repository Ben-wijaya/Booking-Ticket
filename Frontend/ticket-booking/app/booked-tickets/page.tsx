import BookedTicketsForm from "@/components/BookedTickets/BookedTicketsForm";

export default function BookedTicketsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Booked Tickets
      </h1>
      <BookedTicketsForm />
    </div>
  );
}
