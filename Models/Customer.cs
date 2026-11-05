using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.Models;

public class Customer
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Email { get; set; }

    public decimal WalletBalance { get; set; } = 25.00m; // Default starting balance / welcome credit

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Order> Orders { get; set; } = new();
    public List<Reservation> Reservations { get; set; } = new();
    public List<WalletTransaction> WalletTransactions { get; set; } = new();
}
