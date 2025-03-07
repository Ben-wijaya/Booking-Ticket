using System.Collections.Generic;
using Exam1.Models;

namespace Exam1.Features.AvailableTicket
{
    public class GetAvailableTicketsResponse
    {
        public List<TicketOutputDto> Tickets { get; set; }
        public PaginationInfo Pagination { get; set; }
    }

    public class PaginationInfo
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }
}