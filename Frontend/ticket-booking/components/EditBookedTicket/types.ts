export interface EditBookedTicketRequest {
    tickets: {
      ticketCode: string;
      quantity: number;
    }[];
  }
  
  export interface EditBookedTicketResponse {
    ticketCode: string;
    ticketName: string;
    categoryName: string;
    remainingQuantity: number;
  }