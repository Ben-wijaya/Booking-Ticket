using MediatR;
using Microsoft.AspNetCore.Mvc;
using Exam1.Features.BookTicket;
using Exam1.Features.EditBookedTicket;
using Exam1.Features.GetBookedTicket;
using Exam1.Features.RevokeTicket;
using Exam1.Features.AvailableTicket;
using System.Threading.Tasks;

namespace Exam1.Controllers
{
    [ApiController]
    [Route("api/v1")]
    public class BookTicketController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BookTicketController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("book-ticket")]
        public async Task<IActionResult> BookTickets([FromBody] BookTicketCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("get-booked-ticket/{bookedTicketTransactionId}")]
        public async Task<IActionResult> GetBookedTicket(int bookedTicketTransactionId)
        {
            var result = await _mediator.Send(new GetBookedTicketsQuery { BookedTicketTransactionId = bookedTicketTransactionId });
            return Ok(result);
        }

        [HttpDelete("revoke-ticket/{bookedTicketTransactionId}/{ticketCode}/{quantity}")]
        public async Task<IActionResult> RevokeTicket(int bookedTicketTransactionId, string ticketCode, int quantity)
        {
            var result = await _mediator.Send(new RevokeTicketCommand
            {
                BookedTicketTransactionId = bookedTicketTransactionId,
                TicketCode = ticketCode,
                Quantity = quantity
            });
            return Ok(result);
        }

        [HttpPut("edit-booked-ticket/{bookedTicketTransactionId}")]
        public async Task<IActionResult> EditBookedTicket(int bookedTicketTransactionId, [FromBody] List<EditBookedTicketRequest> request)
        {
            var result = await _mediator.Send(new EditBookedTicketCommand
            {
                BookedTicketTransactionId = bookedTicketTransactionId,
                Tickets = request
            });
            return Ok(result);
        }

        [HttpGet("get-available-ticket")]
        public async Task<IActionResult> GetAvailableTickets(
            [FromQuery] string? categoryName,
            [FromQuery] string? ticketCode,
            [FromQuery] string? ticketName,
            [FromQuery] decimal? maxPrice,
            [FromQuery] DateTime? eventDateMin,
            [FromQuery] DateTime? eventDateMax,
            [FromQuery] string? orderBy,
            [FromQuery] string? orderState,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetAvailableTicketsQuery
            {
                CategoryName = categoryName,
                TicketCode = ticketCode,
                TicketName = ticketName,
                MaxPrice = maxPrice,
                EventDateMin = eventDateMin,
                EventDateMax = eventDateMax,
                OrderBy = orderBy,
                OrderState = orderState,
                Page = page,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}