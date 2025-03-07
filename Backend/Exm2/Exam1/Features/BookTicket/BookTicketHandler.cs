using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Exam1.Entities;

namespace Exam1.Features.BookTicket
{
    public class BookTicketHandler : IRequestHandler<BookTicketCommand, TicketBookingResponse>
    {
        private readonly Exam1Context _db;
        private readonly ILogger<BookTicketHandler> _logger;

        public BookTicketHandler(Exam1Context db, ILogger<BookTicketHandler> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<TicketBookingResponse> Handle(BookTicketCommand request, CancellationToken cancellationToken)
        {
            var bookedTickets = new List<BookedTicket>();
            var totalByCategory = new Dictionary<string, decimal>();
            decimal grandTotal = 0;
            int totalTickets = 0;

            foreach (var ticketRequest in request.Tickets)
            {
                var ticket = await _db.Tickets
                    .Include(t => t.Category)
                    .FirstOrDefaultAsync(t => t.TicketCode == ticketRequest.TicketCode, cancellationToken);

                if (ticket == null)
                {
                    throw new ArgumentException($"Ticket with code '{ticketRequest.TicketCode}' does not exist.");
                }

                if (ticket.Quota <= 0)
                {
                    throw new ArgumentException($"Ticket '{ticket.TicketName}' is sold out.");
                }

                if (ticketRequest.Quantity > ticket.Quota)
                {
                    throw new ArgumentException($"Requested quantity for ticket '{ticket.TicketName}' exceeds available quota.");
                }

                if (!DateTime.TryParseExact(ticketRequest.BookingDate, "yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedBookingDate))
                {
                    throw new ArgumentException($"Invalid date format for ticket '{ticket.TicketName}'. Use 'YYYY-MM-DD HH:mm:ss.fff'.");
                }

                if (parsedBookingDate < ticket.EventDateMinimal || parsedBookingDate > ticket.EventDateMaximal)
                {
                    throw new ArgumentException($"Event date for ticket '{ticket.TicketName}' is not within the valid range.");
                }

                // Kurangi quota tiket
                ticket.Quota -= ticketRequest.Quantity;
                await _db.SaveChangesAsync(cancellationToken);

                // Tambahkan tiket yang dipesan ke daftar transaksi
                var bookedTicket = new BookedTicket
                {
                    TicketCode = ticket.TicketCode,
                    Quantity = ticketRequest.Quantity,
                    Price = ticket.Price,
                    BookedDate = parsedBookingDate,
                    CreatedAt = DateTime.UtcNow
                };

                bookedTickets.Add(bookedTicket);

                if (!totalByCategory.ContainsKey(ticket.Category.CategoryName))
                {
                    totalByCategory[ticket.Category.CategoryName] = 0;
                }
                totalByCategory[ticket.Category.CategoryName] += bookedTicket.Quantity * bookedTicket.Price;

                grandTotal += bookedTicket.Quantity * bookedTicket.Price;
                totalTickets += bookedTicket.Quantity;
            }

            // Simpan transaksi
            var bookedTransaction = new BookedTicketTransaction
            {
                TotalTickets = totalTickets,
                SummaryPrice = grandTotal,
                CreatedAt = DateTime.UtcNow
            };

            _db.BookedTicketTransactions.Add(bookedTransaction);
            await _db.SaveChangesAsync(cancellationToken);

            // Set BookedTicketTransactionId ke semua tiket yang dipesan
            foreach (var bookedTicket in bookedTickets)
            {
                bookedTicket.BookedTicketTransactionId = bookedTransaction.BookedTicketTransactionId;
            }

            _db.BookedTickets.AddRange(bookedTickets);
            await _db.SaveChangesAsync(cancellationToken);

            return new TicketBookingResponse
            {
                Tickets = bookedTickets.Select(bt => new BookedTicketDetail
                {
                    TicketCode = bt.TicketCode,
                    TicketName = _db.Tickets
                        .Where(t => t.TicketCode == bt.TicketCode)
                        .Select(t => t.TicketName)
                        .FirstOrDefault() ?? "Unknown",
                    CategoryName = _db.Tickets
                        .Where(t => t.TicketCode == bt.TicketCode)
                        .Select(t => t.Category.CategoryName)
                        .FirstOrDefault() ?? "Unknown",
                    Price = bt.Price,
                    Quantity = bt.Quantity,
                    BookingDate = bt.BookedDate
                }).ToList(),
                CategoryTotals = totalByCategory.Select(ct => new CategorySummary
                {
                    CategoryName = ct.Key,
                    TotalPrice = ct.Value
                }).ToList(),
                GrandTotal = grandTotal,
                TotalTickets = totalTickets
            };
        }
    }
}