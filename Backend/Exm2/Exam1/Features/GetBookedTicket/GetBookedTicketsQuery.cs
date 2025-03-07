using MediatR;
using System.Collections.Generic;

namespace Exam1.Features.GetBookedTicket
{
    public class GetBookedTicketsQuery : IRequest<List<GetBookedTicketsResponse>>
    {
        public int BookedTicketTransactionId { get; set; }
    }
}