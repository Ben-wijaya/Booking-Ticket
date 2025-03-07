export interface Ticket {
    ticketCode: string;
    ticketName: string;
    categoryName: string;
    price: number;
    quota: number | null;
    eventDateMinimal: string;
    eventDateMaximal: string;
  }
  
  export interface Filter {
    categoryName?: string;
    ticketCode?: string;
    ticketName?: string;
    maxPrice?: string;
    eventDateMin?: string;
    eventDateMax?: string;
    orderBy?: string;
    orderState?: string;
    page?: number;
    pageSize?: number;
  }
  
  export interface PaginationInfo {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }