using MediatR;
using System.Collections.Generic;

namespace Exam1.Features.BookTicket
{
    public class BookTicketCommand : IRequest<TicketBookingResponse>
    {
        public List<TicketBookingDetail> Tickets { get; set; }
    }

    public class TicketBookingDetail
    {
        public string TicketCode { get; set; }
        public int Quantity { get; set; }
        public string BookingDate { get; set; }
    }
}