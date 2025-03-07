using MediatR;

namespace Exam1.Features.AvailableTicket
{
    public class GetAvailableTicketsQuery : IRequest<GetAvailableTicketsResponse>
    {
        public string? CategoryName { get; set; }
        public string? TicketCode { get; set; }
        public string? TicketName { get; set; }
        public decimal? MaxPrice { get; set; }
        public DateTime? EventDateMin { get; set; }
        public DateTime? EventDateMax { get; set; }
        public string? OrderBy { get; set; }
        public string? OrderState { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}