"use client";

import RevokeTicketForm from "@/components/RevokeTicket/RevokeTicketForm";

export default function RevokeTicketPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Revoke Ticket
      </h1>
      <RevokeTicketForm />
    </div>
  );
}
