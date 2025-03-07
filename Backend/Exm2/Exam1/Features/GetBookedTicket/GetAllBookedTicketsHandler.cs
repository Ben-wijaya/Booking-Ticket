using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Exam1.Entities;
using Exam1.Features.BookTicket;

namespace Exam1.Features.GetBookedTicket
{
    public class GetAllBookedTicketsHandler : IRequestHandler<GetAllBookedTicketsQuery, List<BookedTicketDetail>>
    {
        private readonly Exam1Context _db;

        public GetAllBookedTicketsHandler(Exam1Context db)
        {
            _db = db;
        }

        public async Task<List<BookedTicketDetail>> Handle(GetAllBookedTicketsQuery request, CancellationToken cancellationToken)
        {
            var bookedTickets = await _db.BookedTickets
                .Include(bt => bt.TicketCodeNavigation) // Include informasi tiket
                .ThenInclude(t => t.Category) // Include informasi kategori
                .Select(bt => new BookedTicketDetail
                {
                    TicketCode = bt.TicketCode,
                    TicketName = bt.TicketCodeNavigation.TicketName,
                    CategoryName = bt.TicketCodeNavigation.Category.CategoryName,
                    Quantity = bt.Quantity,
                    BookingDate = bt.BookedDate
                })
                .ToListAsync(cancellationToken);

            return bookedTickets;
        }
    }
}