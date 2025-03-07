"use client";

import { Ticket, PaginationInfo } from "./types";

interface AvailableTicketsTableProps {
  tickets: Ticket[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const AvailableTicketsTable: React.FC<AvailableTicketsTableProps> = ({
  tickets,
  pagination,
  onPageChange,
}) => {
  return (
    <div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-black border-black border">
              Ticket Code
            </th>
            <th className="px-6 py-3 text-left text-black border-black border">
              Ticket Name
            </th>
            <th className="px-6 py-3 text-left text-black border-black border">
              Category
            </th>
            <th className="px-6 py-3 text-left text-black border-black border">
              Price
            </th>
            <th className="px-6 py-3 text-left text-black border-black border">
              Quota
            </th>
            <th className="px-6 py-3 text-left text-black border-black border">
              Event Start
            </th>
            <th className="px-6 py-3 text-left text-black border-black border">
              Event End
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticketCode} className="border-b">
              <td className="px-6 py-4 text-black border-black border">
                {ticket.ticketCode}
              </td>
              <td className="px-6 py-4 text-black border-black border">
                {ticket.ticketName}
              </td>
              <td className="px-6 py-4 text-black border-black border">
                {ticket.categoryName}
              </td>
              <td className="px-6 py-4 text-black border-black border">
                Rp. {ticket.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-black border-black border">
                {ticket.quota ?? 0}
              </td>
              <td className="px-6 py-4 text-black border-black border">
                {new Date(ticket.eventDateMinimal).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-black border-black border">
                {new Date(ticket.eventDateMaximal).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`bg-blue-500 text-white rounded ${
            pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          } w-30 mr-2 p-2`}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={`bg-blue-500 text-white rounded ${
            pagination.currentPage === pagination.totalPages
              ? "opacity-50 cursor-not-allowed"
              : ""
          } w-30 ml-2 p-2`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AvailableTicketsTable;
