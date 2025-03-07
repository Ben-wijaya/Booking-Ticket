using Exam1.Features.BookTicket;
using Exam1.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Collections.Generic;
using System.Globalization;

namespace Exam1.Services
{
    public class PdfReportService
    {
        public byte[] GenerateTicketReport(List<TicketOutputDto> availableTickets, List<BookedTicketDetail> bookedTickets)
        {
            // Set license (gratis untuk proyek non-komersial)
            QuestPDF.Settings.License = LicenseType.Community;

            // Buat dokumen PDF
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .Text("Ticket Report")
                        .SemiBold().FontSize(24).AlignCenter();

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            // Section 1: Available Tickets
                            column.Item().Text("Available Tickets").Bold().FontSize(18);
                            column.Item().Table(table =>
                            {
                                // Definisikan Kolom
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(); // Ticket Code
                                    columns.RelativeColumn(); // Ticket Name
                                    columns.RelativeColumn(); // Category Name
                                    columns.RelativeColumn(); // Price
                                    columns.RelativeColumn(); // Quota
                                    columns.RelativeColumn(); // Event Start
                                    columns.RelativeColumn(); // Event End
                                });

                                // Header
                                table.Header(header =>
                                {
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Ticket Code").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Ticket Name").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Category Name").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Price").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Quota").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Event Start").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Event End").Bold();
                                });

                                // Isi Tabel
                                foreach (var ticket in availableTickets)
                                {
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.TicketCode);
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.TicketName);
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.CategoryName);
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(FormatRupiah(ticket.Price));
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.Quota?.ToString() ?? "0");
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.EventDateMinimal);
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.EventDateMaximal);
                                }
                            });

                            // Section 2: Booked Tickets
                            column.Item().PaddingTop(20).Text("Booked Tickets").Bold().FontSize(18);
                            column.Item().Table(table =>
                            {
                                // Definisikan kolom
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(); // Ticket Code
                                    columns.RelativeColumn(); // Ticket Name
                                    columns.RelativeColumn(); // Category Name
                                    columns.RelativeColumn(); // Quantity
                                    columns.RelativeColumn(); // Booking Date
                                });

                                // Header
                                table.Header(header =>
                                {
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Ticket Code").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Ticket Name").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Category Name").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Quantity").Bold();
                                    header.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text("Booking Date").Bold();
                                });

                                // Isi Tabel
                                foreach (var ticket in bookedTickets)
                                {
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.TicketCode);
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.TicketName);
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.CategoryName);
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.Quantity.ToString());
                                    table.Cell().Border(1).BorderColor(Colors.Grey.Lighten2).Text(ticket.BookingDate.ToString("yyyy-MM-dd HH:mm:ss"));
                                }
                            });
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                        });
                });
            });

            // Generate PDF sebagai byte array
            return document.GeneratePdf();
        }

        // Format price ke Rupiah
        private string FormatRupiah(decimal amount)
        {
            return $"Rp{amount.ToString("N0", CultureInfo.CreateSpecificCulture("id-ID"))}";
        }
    }
}