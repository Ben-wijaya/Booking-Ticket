export interface BookedTicket {
    ticketCode: string;
    ticketName: string;
    quantity: number;
    bookingDate: string;
  }
  
  export interface BookedTicketResponse {
    categoryName: string;
    qtyPerCategory: number;
    tickets: BookedTicket[];
  }