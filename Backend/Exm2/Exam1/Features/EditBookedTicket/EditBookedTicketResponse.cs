namespace Exam1.Features.EditBookedTicket
{
    public class EditBookedTicketResponse
    {
        public string TicketCode { get; set; }
        public string TicketName { get; set; }
        public string CategoryName { get; set; }
        public int RemainingQuantity { get; set; }
    }
}