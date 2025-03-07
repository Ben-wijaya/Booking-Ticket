using System;
using System.Collections.Generic;

namespace Exam1.Features.BookTicket
{
    public class TicketBookingResponse
    {
        public List<BookedTicketDetail> Tickets { get; set; }
        public List<CategorySummary> CategoryTotals { get; set; }
        public decimal GrandTotal { get; set; }
        public int TotalTickets { get; set; }
    }

    public class BookedTicketDetail
    {
        public string TicketCode { get; set; }
        public string TicketName { get; set; }
        public string CategoryName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateTime BookingDate { get; set; }
    }

    public class CategorySummary
    {
        public string CategoryName { get; set; }
        public decimal TotalPrice { get; set; }
    }
}