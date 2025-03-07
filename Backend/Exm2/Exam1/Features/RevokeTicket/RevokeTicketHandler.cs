using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Exam1.Entities;
using Exam1.Features.RevokeTicket;

namespace Exam1.Features.BookTicket
{
    public class RevokeTicketHandler : IRequestHandler<RevokeTicketCommand, RevokeTicketResponse>
    {
        private readonly Exam1Context _db;

        public RevokeTicketHandler(Exam1Context db)
        {
            _db = db;
        }

        public async Task<RevokeTicketResponse> Handle(RevokeTicketCommand request, CancellationToken cancellationToken)
        {
            // Ambil transaksi beserta tiket yang dipesan
            var transaction = await _db.BookedTicketTransactions
                .Include(t => t.BookedTickets)
                    .ThenInclude(bt => bt.TicketCodeNavigation)
                        .ThenInclude(t => t.Category) // Include kategori
                .FirstOrDefaultAsync(t => t.BookedTicketTransactionId == request.BookedTicketTransactionId, cancellationToken);

            if (transaction == null)
            {
                throw new ArgumentException($"Transaction with ID {request.BookedTicketTransactionId} not found.");
            }

            // Ambil tiket yang akan di-revoke
            var bookedTicket = transaction.BookedTickets
                .FirstOrDefault(bt => bt.TicketCode == request.TicketCode);

            if (bookedTicket == null)
            {
                throw new ArgumentException($"Ticket with code '{request.TicketCode}' not found in transaction {request.BookedTicketTransactionId}.");
            }

            if (request.Quantity > bookedTicket.Quantity)
            {
                throw new ArgumentException($"Requested quantity ({request.Quantity}) exceeds booked quantity ({bookedTicket.Quantity}).");
            }

            // Kurangi quantity tiket
            bookedTicket.Quantity -= request.Quantity;

            // Jika quantity menjadi 0, hapus tiket tersebut
            if (bookedTicket.Quantity == 0)
            {
                _db.BookedTickets.Remove(bookedTicket);
            }

            // Update TotalTickets pada transaksi
            transaction.TotalTickets -= request.Quantity;

            // Jika semua tiket dalam transaksi dihapus, hapus transaksi tersebut
            if (transaction.BookedTickets.All(bt => bt.Quantity == 0))
            {
                _db.BookedTicketTransactions.Remove(transaction);
            }

            await _db.SaveChangesAsync(cancellationToken);

            // Pastikan TicketCodeNavigation dan Category tidak null
            if (bookedTicket.TicketCodeNavigation == null || bookedTicket.TicketCodeNavigation.Category == null)
            {
                throw new ArgumentException("Ticket or Category data is missing.");
            }

            return new RevokeTicketResponse
            {
                TicketCode = bookedTicket.TicketCode,
                TicketName = bookedTicket.TicketCodeNavigation.TicketName,
                CategoryName = bookedTicket.TicketCodeNavigation.Category.CategoryName,
                RemainingQuantity = bookedTicket.Quantity
            };
        }
    }
}