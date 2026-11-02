using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.Models;

public class Reservation
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string ReferenceCode { get; set; } = string.Empty;

    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    [Required]
    [MaxLength(100)]
    public string GuestName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    public int PartySize { get; set; } = 2;

    [Required]
    [MaxLength(30)]
    public string ReservationDate { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string ReservationTime { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string SeatingZone { get; set; } = "Indoor Lounge";

    [MaxLength(500)]
    public string? SpecialNotes { get; set; }

    [MaxLength(30)]
    public string Status { get; set; } = "Confirmed"; // Confirmed, Completed, Cancelled

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
