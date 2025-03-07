using MediatR;

namespace Exam1.Features.RevokeTicket
{
    public class RevokeTicketCommand : IRequest<RevokeTicketResponse>
    {
        public int BookedTicketTransactionId { get; set; }
        public string TicketCode { get; set; }
        public int Quantity { get; set; }
    }
}