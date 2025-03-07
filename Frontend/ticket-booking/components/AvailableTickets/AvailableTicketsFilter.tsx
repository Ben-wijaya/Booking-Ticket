"use client";

import { Filter } from "./types";

interface AvailableTicketsFilterProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const AvailableTicketsFilter: React.FC<AvailableTicketsFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const newValue =
      name === "page" && (value === "" || value === null)
        ? "1"
        : name === "pageSize" && (value === "" || value === null)
        ? "10"
        : value;

    onFilterChange({ ...filter, [name]: newValue });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilterChange(filter);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="ticketCode" className="mb-1 text-black">
            Ticket Code
          </label>
          <input
            type="text"
            name="ticketCode"
            placeholder="Ticket Code"
            value={filter.ticketCode}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="ticketName" className="mb-1 text-black">
            Ticket Name
          </label>
          <input
            type="text"
            name="ticketName"
            placeholder="Ticket Name"
            value={filter.ticketName}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="categoryName" className="mb-1 text-black">
            Category
          </label>
          <input
            type="text"
            name="categoryName"
            placeholder="Category"
            value={filter.categoryName}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="maxPrice" className="mb-1 text-black">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filter.maxPrice}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="eventDateMin" className="mb-1 text-black">
            Event Date Min
          </label>
          <input
            type="datetime-local"
            name="eventDateMin"
            value={filter.eventDateMin}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="eventDateMax" className="mb-1 text-black">
            Event Date Max
          </label>
          <input
            type="datetime-local"
            name="eventDateMax"
            value={filter.eventDateMax}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="orderBy" className="mb-1 text-black">
            Order By
          </label>
          <select
            name="orderBy"
            value={filter.orderBy}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          >
            <option value="">Select Order By</option>
            <option value="ticketCode">Ticket Code</option>
            <option value="ticketName">Ticket Name</option>
            <option value="price">Price</option>
            <option value="eventDateMinimal">Event Date Min</option>
            <option value="eventDateMaximal">Event Date Max</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="orderState" className="mb-1 text-black">
            Order State
          </label>
          <select
            name="orderState"
            value={filter.orderState}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          >
            <option value="">Select Order State</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="page" className="mb-1 text-black">
            Page
          </label>
          <input
            type="number"
            name="page"
            placeholder="Page Number"
            value={filter.page}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pageSize" className="mb-1 text-black">
            Page Size
          </label>
          <input
            type="number"
            name="pageSize"
            placeholder="Page Size"
            value={filter.pageSize}
            onChange={handleInputChange}
            className="border-black border p-2 text-black"
          />
        </div>
        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2">
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default AvailableTicketsFilter;
