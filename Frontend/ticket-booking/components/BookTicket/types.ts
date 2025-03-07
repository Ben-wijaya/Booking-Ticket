export interface TicketBookingDetail {
    ticketCode: string;
    quantity: number;
    bookingDate: string;
  }
  
  export interface BookedTicketDetail {
    ticketCode: string;
    ticketName: string;
    categoryName: string;
    price: number;
    quantity: number;
    bookingDate: string;
  }
  
  export interface CategorySummary {
    categoryName: string;
    totalPrice: number;
  }
  
  export interface BookTicketResponse {
    tickets: BookedTicketDetail[];
    categoryTotals: CategorySummary[];
    grandTotal: number;
    totalTickets: number;
  }