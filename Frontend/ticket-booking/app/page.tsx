import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Ticket Booking App
      </h1>
      <div className="flex flex-col space-y-4 max-w-md mx-auto">
        <Link
          href="/book-ticket"
          className="bg-green-600 text-white py-2 px-4 rounded-md text-center"
        >
          Book Ticket
        </Link>
        <Link
          href="/booked-tickets"
          className="bg-blue-600 text-white py-2 px-4 rounded-md text-center"
        >
          View Booked Tickets
        </Link>
        <Link
          href="/edit-booked-ticket"
          className="bg-orange-600 text-white py-2 px-4 rounded-md text-center"
        >
          Edit Booked Tickets
        </Link>
        <Link
          href="/revoke-ticket"
          className="bg-red-600 text-white py-2 px-4 rounded-md text-center"
        >
          Revoke Ticket
        </Link>
        <Link
          href="/available-tickets"
          className="bg-blue-600 text-white py-2 px-4 rounded-md text-center"
        >
          Available Tickets
        </Link>
      </div>
    </div>
  );
}
