using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeLandingPage.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string OrderReference { get; set; } = string.Empty;

    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    [Required]
    [MaxLength(100)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string DiningOption { get; set; } = "takeaway"; // takeaway, dinein, curbside

    [MaxLength(100)]
    public string PickupTimeOrTable { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? SpecialNotes { get; set; }

    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "Pay at Pickup Counter";

    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Discount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Tax { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [MaxLength(30)]
    public string Status { get; set; } = "Pending"; // Pending, Brewing, Ready, Completed, Cancelled

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = new();
}
