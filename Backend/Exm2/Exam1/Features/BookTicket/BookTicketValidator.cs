using FluentValidation;
using Exam1.Features.BookTicket;

namespace Exam1.Features.BookTicket
{
    public class BookTicketValidator : AbstractValidator<BookTicketCommand>
    {
        public BookTicketValidator()
        {
            RuleFor(x => x.Tickets).NotEmpty().WithMessage("Tickets field cannot be empty.");
            RuleForEach(x => x.Tickets).SetValidator(new TicketBookingDetailValidator());
        }
    }

    public class TicketBookingDetailValidator : AbstractValidator<TicketBookingDetail>
    {
        public TicketBookingDetailValidator()
        {
            RuleFor(x => x.TicketCode).NotEmpty().WithMessage("TicketCode is required.");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than zero.");
            RuleFor(x => x.BookingDate).NotEmpty().WithMessage("BookingDate is required.");
        }
    }
}