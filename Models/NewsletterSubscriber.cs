using System.ComponentModel.DataAnnotations;

namespace CafeLandingPage.Models;

public class NewsletterSubscriber
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
}
