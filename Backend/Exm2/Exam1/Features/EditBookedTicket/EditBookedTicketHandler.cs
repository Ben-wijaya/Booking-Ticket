using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Exam1.Entities;
using Exam1.Features.EditBookedTicket;

namespace Exam1.Features.EditBookedTicket
{
    public class EditBookedTicketHandler : IRequestHandler<EditBookedTicketCommand, List<EditBookedTicketResponse>>
    {
        private readonly Exam1Context _db;

        public EditBookedTicketHandler(Exam1Context db)
        {
            _db = db;
        }

        public async Task<List<EditBookedTicketResponse>> Handle(EditBookedTicketCommand request, CancellationToken cancellationToken)
        {
            var response = new List<EditBookedTicketResponse>();
            var transaction = await _db.BookedTicketTransactions
                .Include(t => t.BookedTickets)
                    .ThenInclude(bt => bt.TicketCodeNavigation)
                        .ThenInclude(t => t.Category)
                .FirstOrDefaultAsync(t => t.BookedTicketTransactionId == request.BookedTicketTransactionId, cancellationToken);

            if (transaction == null)
            {
                throw new ArgumentException($"Transaction with ID {request.BookedTicketTransactionId} not found.");
            }

            foreach (var item in request.Tickets)
            {
                var bookedTicket = transaction.BookedTickets
                    .FirstOrDefault(bt => bt.TicketCode == item.TicketCode);

                if (bookedTicket == null)
                {
                    throw new ArgumentException($"Ticket with code '{item.TicketCode}' not found in transaction {request.BookedTicketTransactionId}.");
                }

                var ticket = await _db.Tickets
                    .Include(t => t.Category)
                    .FirstOrDefaultAsync(t => t.TicketCode == item.TicketCode, cancellationToken);

                if (ticket == null)
                {
                    throw new ArgumentException($"Ticket with code '{item.TicketCode}' not found.");
                }

                if (item.Quantity > ticket.Quota + bookedTicket.Quantity)
                {
                    throw new ArgumentException($"Requested quantity ({item.Quantity}) exceeds available quota.");
                }

                // Update quota tiket
                ticket.Quota += bookedTicket.Quantity - item.Quantity;

                // Update quantity pada BookedTicket
                var oldQuantity = bookedTicket.Quantity;
                bookedTicket.Quantity = item.Quantity;

                // Update TotalTickets pada BookedTicketTransaction
                transaction.TotalTickets += item.Quantity - oldQuantity;

                response.Add(new EditBookedTicketResponse
                {
                    TicketCode = bookedTicket.TicketCode,
                    TicketName = bookedTicket.TicketCodeNavigation.TicketName,
                    CategoryName = bookedTicket.TicketCodeNavigation.Category.CategoryName, // Ambil nama kategori
                    RemainingQuantity = bookedTicket.Quantity
                });
            }

            // Hapus transaksi jika semua tiket dihapus
            if (transaction.BookedTickets.All(bt => bt.Quantity == 0))
            {
                _db.BookedTicketTransactions.Remove(transaction);
            }

            await _db.SaveChangesAsync(cancellationToken);

            return response;
        }
    }
}