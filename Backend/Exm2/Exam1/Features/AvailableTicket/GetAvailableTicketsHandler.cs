using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Exam1.Entities;
using Exam1.Models;

namespace Exam1.Features.AvailableTicket
{
    public class GetAvailableTicketsHandler : IRequestHandler<GetAvailableTicketsQuery, GetAvailableTicketsResponse>
    {
        private readonly Exam1Context _db;

        public GetAvailableTicketsHandler(Exam1Context db)
        {
            _db = db;
        }

        public async Task<GetAvailableTicketsResponse> Handle(GetAvailableTicketsQuery request, CancellationToken cancellationToken)
        {
            var query = _db.Tickets.AsQueryable();

            // Filter by category
            if (!string.IsNullOrEmpty(request.CategoryName))
            {
                query = query.Where(t => t.Category.CategoryName.Contains(request.CategoryName));
            }

            // Filter by ticket code
            if (!string.IsNullOrEmpty(request.TicketCode))
            {
                query = query.Where(t => t.TicketCode.Contains(request.TicketCode));
            }

            // Filter by ticket name
            if (!string.IsNullOrEmpty(request.TicketName))
            {
                query = query.Where(t => t.TicketName.Contains(request.TicketName));
            }

            // Filter by maximum price
            if (request.MaxPrice.HasValue)
            {
                query = query.Where(t => t.Price <= request.MaxPrice.Value);
            }

            // Filter by event date min
            if (request.EventDateMin.HasValue)
            {
                query = query.Where(t => t.EventDateMinimal >= request.EventDateMin.Value);
            }

            // Filter by event date max
            if (request.EventDateMax.HasValue)
            {
                query = query.Where(t => t.EventDateMaximal <= request.EventDateMax.Value);
            }

            // Handling order by
            if (!string.IsNullOrEmpty(request.OrderBy))
            {
                var orderByLower = request.OrderBy.ToLower();
                var orderStateLower = request.OrderState?.ToLower();

                // Build ordering based on valid criteria
                switch (orderByLower)
                {
                    case "ticketcode":
                        query = orderStateLower == "asc" ? query.OrderBy(t => t.TicketCode) : query.OrderByDescending(t => t.TicketCode);
                        break;
                    case "ticketname":
                        query = orderStateLower == "asc" ? query.OrderBy(t => t.TicketName) : query.OrderByDescending(t => t.TicketName);
                        break;
                    case "price":
                        query = orderStateLower == "asc" ? query.OrderBy(t => t.Price) : query.OrderByDescending(t => t.Price);
                        break;
                    case "categoryname":
                        query = orderStateLower == "asc" ? query.OrderBy(t => t.Category) : query.OrderByDescending(t => t.Category);
                        break;
                    case "eventdateminimal":
                        query = orderStateLower == "asc" ? query.OrderBy(t => t.EventDateMinimal) : query.OrderByDescending(t => t.EventDateMinimal);
                        break;
                    case "eventdatemaximal":
                        query = orderStateLower == "asc" ? query.OrderBy(t => t.EventDateMaximal) : query.OrderByDescending(t => t.EventDateMaximal);
                        break;
                    default:
                        // Invalid OrderBy option - log and/or handle as needed
                        throw new ArgumentException($"Invalid OrderBy value: {request.OrderBy}");
                }
            }

            // Ensure querying is protected against null category references
            var ticketsQuery = query.Include(t => t.Category).AsQueryable();

            var totalCount = await ticketsQuery.CountAsync(cancellationToken);
            var tickets = await ticketsQuery
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(t => new TicketOutputDto
                {
                    TicketCode = t.TicketCode,
                    TicketName = t.TicketName,
                    CategoryName = t.Category != null ? t.Category.CategoryName : "Unknown", // Handle potential null category
                    Price = t.Price,
                    Quota = t.Quota,
                    EventDateMinimal = t.EventDateMinimal.ToString("yyyy-MM-dd HH:mm:ss"),
                    EventDateMaximal = t.EventDateMaximal.ToString("yyyy-MM-dd HH:mm:ss")
                })
                .ToListAsync(cancellationToken);

            return new GetAvailableTicketsResponse
            {
                Tickets = tickets,
                Pagination = new PaginationInfo
                {
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize),
                    CurrentPage = request.Page,
                    PageSize = request.PageSize
                }
            };
        }
    }
}