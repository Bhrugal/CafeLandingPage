using Microsoft.AspNetCore.Mvc;
using Dapper;
using CafeLandingPage.Data;
using CafeLandingPage.DTOs;

namespace CafeLandingPage.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly CafeDatabase _database;

    public NewsletterController(CafeDatabase database)
    {
        _database = database;
    }

    [HttpPost("subscribe")]
    public async Task<ActionResult<ApiResponse>> Subscribe([FromBody] SubscribeDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse.Fail("Please enter a valid email address."));
        }

        var emailClean = dto.Email.Trim().ToLowerInvariant();

        using var connection = _database.CreateConnection();

        var existing = await connection.ExecuteScalarAsync<int>(
            "SELECT COUNT(*) FROM NewsletterSubscribers WHERE Email = @Email;",
            new { Email = emailClean });

        if (existing > 0)
        {
            return Ok(ApiResponse.SuccessResult("You are already subscribed to the Haven VIP Coffee Club!"));
        }

        var now = DateTime.UtcNow.ToString("o");
        await connection.ExecuteAsync(
            "INSERT INTO NewsletterSubscribers (Email, SubscribedAt) VALUES (@Email, @SubscribedAt);",
            new { Email = emailClean, SubscribedAt = now });

        return Ok(ApiResponse.SuccessResult("Welcome to the Haven Club! Free croissant voucher sent to your inbox."));
    }

    [HttpGet("subscribers")]
    public async Task<ActionResult<ApiResponse>> GetAllSubscribers()
    {
        using var connection = _database.CreateConnection();
        var subscribers = await connection.QueryAsync(
            "SELECT * FROM NewsletterSubscribers ORDER BY SubscribedAt DESC;");

        return Ok(ApiResponse.SuccessResult("Subscribers retrieved", subscribers));
    }
}
