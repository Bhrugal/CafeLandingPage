using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.DTOs;

public class CreateOrderDto
{
    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Contact phone is required.")]
    public string CustomerPhone { get; set; } = string.Empty;

    public string? CustomerEmail { get; set; }

    [Required]
    public string DiningOption { get; set; } = "takeaway"; // takeaway, dinein, curbside

    public string? PickupTimeOrTable { get; set; }

    public string? SpecialNotes { get; set; }

    [Required]
    public string PaymentMethod { get; set; } = "Pay at Counter"; // "Pay at Counter", "Haven Wallet", "Credit Card"

    public string? PromoCode { get; set; }

    // Stripe Payment Intent ID when processed via Stripe Gateway
    public string? PaymentIntentId { get; set; }

    // Card details when PaymentMethod is Credit Card
    public CardPaymentDto? CardDetails { get; set; }

    // Table Reservation linking (when user wants to book table together with food/drink)
    public bool ReserveTable { get; set; } = false;
    public int PartySize { get; set; } = 2;
    public string? ReservationDate { get; set; }
    public string? ReservationTime { get; set; }
    public string? SeatingZone { get; set; } = "Indoor Lounge";

    [Required]
    [MinLength(1, ErrorMessage = "At least one item is required in the order.")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CardPaymentDto
{
    public string? PaymentIntentId { get; set; }
    public string? CardNumber { get; set; }
    public string? CardHolder { get; set; }
    public string? ExpiryDate { get; set; }
    public string? Cvc { get; set; }
    public string? ZipCode { get; set; }
}

public class CreateOrderItemDto
{
    public int MenuItemId { get; set; }

    [Required]
    public string ItemName { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    [Range(0.01, 10000.00, ErrorMessage = "Unit price must be greater than 0.")]
    public decimal UnitPrice { get; set; }

    [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100.")]
    public int Quantity { get; set; } = 1;

    public string? CustomDetails { get; set; }
}

public class OrderResponseDto
{
    public int Id { get; set; }
    public string OrderReference { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string DiningOption { get; set; } = string.Empty;
    public string PickupTimeOrTable { get; set; } = string.Empty;
    public string? SpecialNotes { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public string? BookingCode { get; set; }
    public int? ReservationId { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int Id { get; set; }
    public int MenuItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public string CustomDetails { get; set; } = string.Empty;
    public decimal LineTotal { get; set; }
}
