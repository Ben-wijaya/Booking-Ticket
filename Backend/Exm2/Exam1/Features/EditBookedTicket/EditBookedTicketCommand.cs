using Exam1.Features.EditBookedTicket;
using MediatR;
using System.Collections.Generic;

namespace Exam1.Features.EditBookedTicket
{
    public class EditBookedTicketCommand : IRequest<List<EditBookedTicketResponse>>
    {
        public int BookedTicketTransactionId { get; set; }
        public List<EditBookedTicketRequest> Tickets { get; set; }
    }
}