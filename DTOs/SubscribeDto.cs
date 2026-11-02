using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.DTOs;

public class SubscribeDto
{
    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Please provide a valid email address.")]
    public string Email { get; set; } = string.Empty;
}
