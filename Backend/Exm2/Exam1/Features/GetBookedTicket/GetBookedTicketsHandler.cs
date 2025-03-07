using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Exam1.Entities;
using Exam1.Features.GetBookedTicket;

namespace Exam1.Features.GetBookedTicket
{
    public class GetBookedTicketsHandler : IRequestHandler<GetBookedTicketsQuery, List<GetBookedTicketsResponse>>
    {
        private readonly Exam1Context _db;

        public GetBookedTicketsHandler(Exam1Context db)
        {
            _db = db;
        }

        public async Task<List<GetBookedTicketsResponse>> Handle(GetBookedTicketsQuery request, CancellationToken cancellationToken)
        {
            var bookedTickets = await _db.BookedTickets
                .Include(bt => bt.TicketCodeNavigation)
                .ThenInclude(t => t.Category)
                .Where(bt => bt.BookedTicketTransactionId == request.BookedTicketTransactionId)
                .ToListAsync(cancellationToken);

            if (bookedTickets == null || !bookedTickets.Any())
            {
                throw new ArgumentException($"Transaction with ID {request.BookedTicketTransactionId} not found.");
            }

            var groupedTickets = bookedTickets
                .GroupBy(bt => bt.TicketCodeNavigation.Category.CategoryName)
                .Select(g => new GetBookedTicketsResponse
                {
                    CategoryName = g.Key,
                    QtyPerCategory = g.Sum(bt => bt.Quantity),
                    Tickets = g.Select(bt => new GetBookedTicketInfo
                    {
                        TicketCode = bt.TicketCode,
                        TicketName = bt.TicketCodeNavigation.TicketName,
                        BookingDate = bt.BookedDate,
                        Quantity = bt.Quantity
                    }).ToList()
                }).ToList();

            return groupedTickets;
        }
    }
}