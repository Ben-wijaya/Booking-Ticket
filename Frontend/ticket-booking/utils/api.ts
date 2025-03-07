import { Filter } from '@/components/AvailableTickets';
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5088/api/v1',
});

// Fungsi untuk mengambil tiket yang tersedia
export const getAvailableTickets = async (filter: Filter) => {
  try {
    const response = await api.get('/get-available-ticket', {
      params: {
        categoryName: filter.categoryName,
        ticketCode: filter.ticketCode,
        ticketName: filter.ticketName,
        maxPrice: filter.maxPrice,
        eventDateMin: filter.eventDateMin,
        eventDateMax: filter.eventDateMax,
        orderBy: filter.orderBy,
        orderState: filter.orderState,
        page: filter.page,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch available tickets');
  }
};

// Fungsi untuk memesan tiket
export const bookTicket = async (data: {
  tickets: { ticketCode: string; quantity: number; bookingDate: string }[];
}) => {
  try {
    const response = await api.post('/book-ticket', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const problemDetails = axiosError.response.data as {
          title?: string;
          detail?: string;
          status?: number;
          type?: string;
        };
        throw new Error(problemDetails.detail || "Failed to book ticket");
      } else {
        throw new Error("Network error: Unable to connect to the server");
      }
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Fungsi untuk mengambil tiket yang sudah dipesan
export const getBookedTickets = async (bookedTicketTransactionId: number) => {
  try {
    const response = await api.get(`/get-booked-ticket/${bookedTicketTransactionId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const problemDetails = axiosError.response.data as {
          title?: string;
          detail?: string;
          status?: number;
          type?: string;
        };
        throw new Error(problemDetails.detail || "Failed to fetch booked tickets");
      } else {
        throw new Error("Network error: Unable to connect to the server");
      }
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Fungsi untuk mengedit tiket yang sudah dipesan
export const editBookedTicket = async (
  bookedTicketTransactionId: number,
  data: { ticketCode: string; quantity: number }[]
) => {
  try {
    const response = await api.put(
      `/edit-booked-ticket/${bookedTicketTransactionId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const problemDetails = axiosError.response.data as {
          title?: string;
          detail?: string;
          status?: number;
          type?: string;
        };
        throw new Error(problemDetails.detail || "Failed to update booked ticket");
      } else {
        throw new Error("Network error: Unable to connect to the server");
      }
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Fungsi untuk membatalkan tiket
export const revokeTicket = async (
  bookedTicketTransactionId: number,
  ticketCode: string,
  quantity: number
) => {
  try {
    const response = await api.delete(`/revoke-ticket/${bookedTicketTransactionId}/${ticketCode}/${quantity}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const problemDetails = axiosError.response.data as {
          title?: string;
          detail?: string;
          status?: number;
          type?: string;
        };
        throw new Error(problemDetails.detail || "Failed to revoke ticket");
      } else {
        throw new Error("Network error: Unable to connect to the server");
      }
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export default api;