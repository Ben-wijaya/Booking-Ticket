using Exam1.Features.BookTicket;
using MediatR;
using System.Collections.Generic;

namespace Exam1.Features.GetBookedTicket
{
    public class GetAllBookedTicketsQuery : IRequest<List<BookedTicketDetail>>
    {
        // Query ini tidak memerlukan parameter karena akan mengambil semua tiket yang dibooked
    }
}