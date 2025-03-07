using System;
using System.Collections.Generic;

namespace Exam1.Features.GetBookedTicket
{
    public class GetBookedTicketsResponse
    {
        public string CategoryName { get; set; }
        public int QtyPerCategory { get; set; }
        public List<GetBookedTicketInfo> Tickets { get; set; }
    }

    public class GetBookedTicketInfo
    {
        public string TicketCode { get; set; }
        public string TicketName { get; set; }
        public DateTime BookingDate { get; set; }
        public int Quantity { get; set; }
    }
}