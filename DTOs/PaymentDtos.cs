using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.DTOs;

public class CreatePaymentIntentDto
{
    [Range(0.50, 10000.00, ErrorMessage = "Amount must be between $0.50 and $10,000.00.")]
    public decimal Amount { get; set; }

    public string Currency { get; set; } = "usd";

    public string? CustomerName { get; set; }

    public string? CustomerEmail { get; set; }

    public string? OrderReference { get; set; }

    public string? Description { get; set; }
}

public class PaymentIntentResponseDto
{
    public string ClientSecret { get; set; } = string.Empty;
    public string PaymentIntentId { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "usd";
    public bool IsLiveStripe { get; set; }
    public string Status { get; set; } = "requires_payment_method";
}

public class StripeConfigDto
{
    public string PublishableKey { get; set; } = string.Empty;
    public bool IsConfigured { get; set; }
    public string Mode { get; set; } = "test"; // "test" or "live"
}

