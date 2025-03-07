"use client";

import { useEffect, useState } from "react";
import { getAvailableTickets } from "@/utils/api";
import AvailableTicketsFilter from "@/components/AvailableTickets/AvailableTicketsFilter";
import AvailableTicketsTable from "@/components/AvailableTickets/AvailableTicketsTable";
import {
  Ticket,
  Filter,
  PaginationInfo,
} from "@/components/AvailableTickets/types";

const AvailableTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<Filter>({
    categoryName: "",
    ticketCode: "",
    ticketName: "",
    maxPrice: "",
    eventDateMin: "",
    eventDateMax: "",
    orderBy: "",
    orderState: "",
    page: 1,
    pageSize: 10,
  });

  const fetchTickets = async () => {
    try {
      const data = await getAvailableTickets(filter);
      setTickets(data.tickets);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      setError("Failed to load tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const handlePageChange = (page: number) => {
    setFilter((prevFilter) => ({ ...prevFilter, page }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="text-2xl mb-4 text-black">Available Tickets</h1>
      <AvailableTicketsFilter
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      <AvailableTicketsTable
        tickets={tickets}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AvailableTickets;
