using MediatR;
using Microsoft.AspNetCore.Mvc;
using Exam1.Features.AvailableTicket;
using Exam1.Features.BookTicket;
using Exam1.Services;
using System.Threading.Tasks;
using Exam1.Features.GetBookedTicket;

namespace Exam1.Controllers
{
    [Route("api/v1/reports")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly PdfReportService _pdfReportService;
        private readonly IMediator _mediator;

        public ReportController(PdfReportService pdfReportService, IMediator mediator)
        {
            _pdfReportService = pdfReportService;
            _mediator = mediator;
        }

        [HttpGet("download-ticket-report")]
        public async Task<IActionResult> DownloadTicketReport()
        {
            try
            {
                // Ambil data tiket yang masih available
                var availableTickets = await _mediator.Send(new GetAvailableTicketsQuery
                {
                    Page = 1,
                    PageSize = int.MaxValue
                });

                // Ambil data tiket yang sudah dibooked menggunakan query baru
                var bookedTickets = await _mediator.Send(new GetAllBookedTicketsQuery());

                // Generate PDF report
                var pdfBytes = _pdfReportService.GenerateTicketReport(availableTickets.Tickets, bookedTickets);

                // Kembalikan file PDF
                return File(pdfBytes, "application/pdf", "TicketReport.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-3.2",
                    Title = "Internal Server Error",
                    Status = 500,
                    Detail = ex.Message
                });
            }
        }
    }
}