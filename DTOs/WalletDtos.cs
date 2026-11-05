using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.DTOs;

public class CustomerWalletDto
{
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public decimal WalletBalance { get; set; }
    public List<WalletTransactionDto> RecentTransactions { get; set; } = new();
}

public class WalletTransactionDto
{
    public string TransactionRef { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // TOPUP, PAYMENT, REFUND
    public decimal Amount { get; set; }
    public decimal BalanceAfter { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TopupWalletDto
{
    [Required(ErrorMessage = "Customer phone number is required.")]
    public string Phone { get; set; } = string.Empty;

    public string? CustomerName { get; set; }

    [Range(1.0, 2000.0, ErrorMessage = "Top-up amount must be between $1 and $2000.")]
    public decimal Amount { get; set; }
}
