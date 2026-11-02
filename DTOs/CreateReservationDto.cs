using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.DTOs;

public class CreateReservationDto
{
    [Required(ErrorMessage = "Guest name is required.")]
    [StringLength(100, MinimumLength = 2)]
    public string GuestName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Please provide a valid email address.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    public string Phone { get; set; } = string.Empty;

    [Range(1, 20, ErrorMessage = "Party size must be between 1 and 20 guests.")]
    public int PartySize { get; set; } = 2;

    [Required(ErrorMessage = "Reservation date is required.")]
    public string ReservationDate { get; set; } = string.Empty;

    [Required(ErrorMessage = "Reservation time slot is required.")]
    public string ReservationTime { get; set; } = string.Empty;

    [Required]
    public string SeatingZone { get; set; } = "Indoor Lounge";

    public string? SpecialNotes { get; set; }
}

public class ReservationResponseDto
{
    public int Id { get; set; }
    public string ReferenceCode { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int PartySize { get; set; }
    public string ReservationDate { get; set; } = string.Empty;
    public string ReservationTime { get; set; } = string.Empty;
    public string SeatingZone { get; set; } = string.Empty;
    public string? SpecialNotes { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
